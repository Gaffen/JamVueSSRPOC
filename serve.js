import Promise from "bluebird";
import co from "co";
import debounce from "lodash.debounce";
import compress from "compression";
import config from "./webpack.config.js";
import webpack from "webpack";
import fs from "fs";

// Set debug variables
process.env.NODE_ENV = process.env.NODE_ENV || "development";

if (!process.env.DEBUG) {
  process.env.DEBUG = "browser-sync-server:*,*:info,*:error";
}

const debug = require("debug")("browser-sync-server");
const error = debug.extend("error");
const info = debug.extend("info");

info("debug", process.env.DEBUG);

// Enable gzip
const gz = true;

const browser_sync = require("browser-sync");
const strip_ansi = require("strip-ansi");
const { spawn } = require("child_process");
const kill = require("tree-kill");

const path = require("path");

// Initialize Browsersync and webpack
const sync = browser_sync.create();

let child;

const run_build_command = command =>
  new Promise((resolve, reject) => {
    child = spawn(command, { stdio: "inherit", shell: true });
    child.on("close", (code, signal) => {
      if (code || signal) {
        reject(`Stopped - code: ${code}, signal: ${signal}`);
      } else {
        resolve();
      }
    });
  });

const kill_child = pid =>
  new Promise((resolve, reject) => {
    kill(pid, "SIGTERM", err => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });

function startServer() {
  sync.init(
    {
      server: path.join(__dirname, "build"),
      cors: true,
      open: true,
      logFileChanges: true,
      plugins: ["bs-fullscreen-message"],
      watchOptions: {
        awaitWriteFinish: {
          stabilityThreshold: 500,
          pollInterval: 100
        }
      },
      files: [
        {
          match: [
            path.join(__dirname, "layouts", "**", "*"),
            path.join(__dirname, "src", "content", "**", "*")
          ],
          fn: (event, file) => {
            debug(`File changed: ${file}`);
            build_site(false);
          }
        },
        {
          match: [
            path.join(__dirname, "src", "js", "**", "*.js"),
            path.join(__dirname, "src", "scss", "**", "*"),
            path.join(__dirname, "src", "svg", "**", "*")
          ],
          fn: () => build_site(true, false)
        },
        {
          match: [path.join(__dirname, "src", "js", "**", "*.vue")],
          fn: () => build_site()
        }
      ],
      middleware: [
        (req, res, next) => {
          if (!gz) return;
          const gzip = compress();
          gzip(req, res, next);
        }
      ]
    },
    (err, bs) => {
      if (err) {
        error(err);
      }
      bs.addMiddleware("*", (req, res) => {
        res.write("404 mayne");
        res.end();
      });
    }
  );
}

// Run build command
const build_site = debounce(
  (build_assets = true, build_site = true, file_filter = "") => {
    if (child && typeof child.pid) {
      info(`Killing ${child.pid}`);
      kill_child(child.pid);
    }

    info("Building Website");

    info(`build_assets: ${build_assets}`);
    info(`file: ${file_filter}`);

    if (build_assets) {
      // console.log("Webpack Started");
      // console.log("Execute webpack build here");
      run_build_command(`webpack --env ${process.env.NODE_ENV} --watch`).then(
        result => {
          sync.reload();
        }
      );
      // console.log("Webpack Finished");
      // yield run_build_command(`npm run spritesheet`);
    }

    if (build_site) {
      info("Build Started");
      const build_command = ["npm run compile"];

      run_build_command(build_command.join(" "));
      info("Build Finished");
    }

    if (!sync.active) {
      startServer();
    }

    child = void 0;
    sync.reload();
  },
  200
);

const compiler = webpack(config(process.env.NODE_ENV));

compiler.watch({}, err => {
  sync.reload();
});

compiler.hooks.afterCompile.tap("eleventy", params => {
  try {
    if (
      !fs.existsSync(
        path.resolve(__dirname, "layouts", "partials", "sprite.svg")
      )
    ) {
      require(path.resolve(__dirname, "svgsprite.js"));
    }
  } catch (err) {
    console.error(err);
  }
  sync.reload();
});

build_site(false, true);
