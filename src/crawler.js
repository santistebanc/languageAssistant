const FetchCrawler = require("@viclafouch/fetch-crawler");

// I use Cheerio to get the content of the page
// See https://cheerio.js.org
const collectContent = ($) =>
  $("body")
    .find("h1")
    .text()
    .trim();

// After getting content of the page, do what you want :)
// Accept async function
const doSomethingWith = (content, url) =>
  console.log(`Here the title '${content}' from ${url}`);

// Here I start my crawler
// You can await for it if you want
FetchCrawler.launch({
  url: "https://github.com",
  evaluatePage: ($) => collectContent($),
  onSuccess: ({ result, url }) => doSomethingWith(result, url),
  onError: ({ error, url }) =>
    console.log("Whouaa something wrong happened :("),
  maxRequest: 20,
});
