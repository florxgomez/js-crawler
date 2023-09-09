function sortPages(pages) {
  keysSorted = Object.keys(pages).sort(function (a, b) {
    return pages[b] - pages[a];
  });
  return keysSorted;
}

function printReport(pages) {
  console.log('starting printing pages...');
  for (const page of sortPages(pages)) {
    console.log(`Found ${pages[page]} internal links to ${page}`);
  }
}

module.exports = {
  printReport,
};
