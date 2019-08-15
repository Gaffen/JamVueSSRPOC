const path = require("path");

module.exports = {
  modules: [
    path.join(__dirname, "../node_modules"),
    path.join(__dirname, "../src")
  ],
  extensions: [".json", ".js"],
  alias: {
    styles: path.resolve(__dirname, "..", "src", "scss")
  }
};
