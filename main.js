const { crawlPage } = require('./crawl');
const { printReport } = require('./report');

async function main() {
  const args = process.argv;
  if (args.length < 3) {
    console.log('please include base url');
  } else if (args.length > 3) {
    console.log('there are too many args');
  } else {
    console.log('crawling starting...');
    const baseURL = args[2];
    const pages = await crawlPage(baseURL, baseURL, {});
    printReport(pages);
  }
}

main();
