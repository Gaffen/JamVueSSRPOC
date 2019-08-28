const path = require("path");
const fs = require("fs");

const Vue = require("vue");
const TemplateCompiler = require("vue-template-compiler");
const VueServerRenderer = require("vue-server-renderer");
const requireFromString = require("require-from-string");
const babel = require("@babel/core");

let manifest = {};

fs.access(
  path.resolve(__dirname, "..", "data", "manifest.json"),
  fs.f_OK,
  err => {
    if (err) {
      console.error(err);
      return;
    }
    manifest = require("../data/manifest.json");
    return;
  }
);

module.exports = function(nunjucksEngine, settings) {
  this.tags = ["vue"];

  this.nunjucksEngine = nunjucksEngine;

  this.parse = function(parser, nodes, lexer) {
    let tok = parser.nextToken();

    let args = parser.parseSignature(null, true);
    parser.advanceAfterBlockEnd(tok.value);

    return new nodes.CallExtensionAsync(this, "run", args);
  };

  this.run = function(context, args, callback) {
    const parsedComponent = TemplateCompiler.parseComponent(
      fs.readFileSync(
        path.join(
          __dirname,
          "..",
          "src",
          "js",
          "components",
          `${args.component}.vue`
        ),
        "utf8"
      )
    );

    const moduleScript = requireFromString(
      babel.transformSync(parsedComponent.script.content, {
        presets: [["@babel/env", { modules: false, loose: true }]],
        plugins: ["@babel/plugin-transform-modules-commonjs"]
      }).code
    ).default;

    const renderer = VueServerRenderer.createRenderer({
      template: `<!--vue-ssr-outlet-->`
    });

    moduleScript.template = parsedComponent.template.content;

    if ("vue" in manifest && manifest.vue[args.component]) {
      moduleScript._scopeId = `data-v-${manifest.vue[args.component]}`;
    }

    let component = Vue.component(args.component, moduleScript);
    let props = "";
    let keys = [];
    if (args.props) {
      props = " ";
      Object.keys(args.props).forEach(e => {
        let data = args.props[e];
        if (typeof data != "string" && typeof data != "undefined") {
          data = JSON.stringify(data);
        }
        props += `${e}='${data}'`;
        keys.push(e);
      });
    }

    renderer.renderToString(
      new Vue({
        props: keys,
        template: `<${args.component}${props}></${args.component}>`
      }),
      (err, result) => {
        if (!err) {
          callback(null, new nunjucksEngine.runtime.SafeString(result));
        } else {
          callback(null, err);
        }
      }
    );
  };
};
