const { JSDOM } = require('jsdom');

function normalizeURL(url) {
  const urlObj = new URL(url);
  let path = `${urlObj.host}${urlObj.pathname}`;
  if (path.length > 0 && path.slice(-1) === '/') {
    path = path.slice(0, -1);
  }

  return path;
}

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const htmlDOM = new JSDOM(htmlBody);
  const linkElements = htmlDOM.window.document.querySelectorAll('a');
  for (const linkElement of linkElements) {
    if (linkElement.href.slice(0, 1) === '/') {
      try {
        urls.push(new URL(linkElement.href, baseURL).href);
      } catch (err) {
        console.log(`${err.message}: ${linkElement.href}`);
      }
    } else {
      try {
        urls.push(new URL(linkElement.href).href);
      } catch (err) {
        console.log(`${err.message}: ${linkElement.href}`);
      }
    }
  }
  return urls;
}

async function crawlPage(baseURL, currentURL, pages) {
  const current = new URL(currentURL);
  const base = new URL(baseURL);
  if (current.hostname !== base.hostname) {
    return pages;
  }

  const normalizedURL = normalizeURL(currentURL);
  if (pages[normalizedURL] > 0) {
    pages[normalizedURL]++;
    return pages;
  }
  if (currentURL === baseURL) {
    pages[normalizedURL] = 0;
  } else {
    pages[normalizedURL] = 1;
  }

  console.log(`crawling: ${currentURL}`);
  let page = '';
  try {
    const res = await fetch(currentURL);
    if (res.status > 399) {
      console.log(`got http error, status code ${res.status}`);
      return pages;
    }
    const contentType = res.headers.get('content-type');
    if (!contentType.includes('text/html')) {
      console.log(`got non-html response: ${contentType}`);
      return pages;
    }
    page = await res.text();
  } catch (err) {
    console.log(err.message);
  }
  const nextURLs = getURLsFromHTML(page, baseURL);
  for (const nextURL of nextURLs) {
    pages = await crawlPage(baseURL, nextURL, pages);
  }
  return pages;
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};
