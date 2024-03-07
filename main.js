const { argv } = require("node:process");
const { crawlPage } = require("./crawl.js");

function main() {
  if (argv.length !== 3) {
    console.error("You must provide a BASE_URL to crawl.");
    process.exit(1);
  }

  const baseURL = argv[2];
  console.log(`Beginning crawl on ${baseURL}...`);

  crawlPage(baseURL);
}

main();
