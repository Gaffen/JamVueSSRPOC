const path = require("path");
const fs = require("fs");

const Nunjucks = require("nunjucks");

// Require the Vue component render custom tag
const vueTag = require("./njktags/vue");

module.exports = function(eleventyConfig) {
  let nunjucksEnvironment = new Nunjucks.Environment(
    new Nunjucks.FileSystemLoader("layouts")
  );

  eleventyConfig.setLibrary("njk", nunjucksEnvironment);

  let options = {
    html: true
  };

  // Install custom tag
  eleventyConfig.addNunjucksTag("vue", function(nunjucksEngine) {
    return new vueTag(nunjucksEngine);
  });

  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("favicon");

  return {
    dir: {
      input: "src/content",
      output: "build",
      includes: "../../layouts",
      data: "../../data"
    },
    templateFormats: ["md", "njk"]
  };
};
