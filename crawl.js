const { JSDOM } = require("jsdom");

async function crawlPage(baseURL, currentURL, pages) {
  // If w're no longer on the same domain, leave.
  const currentUrlObject = new URL(currentURL);
  const baseUrlObject = new URL(baseURL);
  if (currentUrlObject.hostname !== baseUrlObject.hostname) {
    return pages;
  }

  const normalized = normalizeURL(currentURL);

  if (pages[normalized] > 0) {
    pages[normalized]++;
    return pages;
  }

  pages[normalized] = 1;

  let html = "";
  try {
    const response = await fetch(currentURL);
    if (response.status >= 400) {
      console.error(
        `Unable to reach ${currentURL}, check again or try again later...`,
      );
      return pages;
    }
    const contentType = response.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.error(
        `Did not recieve HTML from request, check ${url} and try again...`,
      );
      return pages;
    }
    html = await response.text();
  } catch (error) {
    console.error(`Error on ${currentURL}: ${error.message}`);
  }

  // Get the next run on URLs and crawl them
  const next = getURLsFromHTML(html, baseURL);
  for (const url of next) {
    pages = await crawlPage(baseURL, url, pages);
  }
  // Finished, return our object
  return pages;
}

function normalizeURL(url) {
  try {
    const urlObject = new URL(url);
    let result = `${urlObject.hostname}${urlObject.pathname}`;
    if (result[result.length - 1] === "/") {
      return result.slice(0, result.length - 1);
    }
    return `${urlObject.hostname}${urlObject.pathname}`;
  } catch (err) {
    console.log("Error normalizing url: ", err.message);
    return null;
  }
}

function getURLsFromHTML(htmlBody, baseURL) {
  const dom = new JSDOM(htmlBody);
  const a = dom.window.document.querySelectorAll("a");
  const result = [];
  a.forEach((link) => {
    if (link.href[0] === "/") {
      try {
        result.push(new URL(link.href, baseURL).href);
      } catch (err) {
        console.log(`${err.message}: ${link.href}`);
      }
    } else {
      try {
        result.push(new URL(link.href).href);
      } catch (err) {
        console.log(`${err.message}: ${link.href}`);
      }
    }
  });
  return result;
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};
