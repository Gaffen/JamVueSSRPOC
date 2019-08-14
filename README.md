# Kindling: A static site generation starterkit using eleventy.js

## How to use:

`npm install` \
`npm start` to open the site in a browser for local development \
`npm run generate` to compile modernizr and svg sprites (if you need that) \
`npm run build` to export the site for upload to the `/build` directory

If you want to use an SVG spritesheet, the `spritesheet` script will compole all svg's contained in `/src/svg`

[Check the eleventy documentation for information on how to construct the site in detail](https://www.11ty.io/docs/)

[Check the Nunjucks documentation for information on how to use the templating language](https://mozilla.github.io/nunjucks/templating.html)

Pages are created bu placing markdown files (like this one!) in the `/src/content` folder.

Javascript and css are compiled from the `/src/js/` and `/src/scss/` folders, by default `styles.scss` and `main.js` are compiled.

The syles are written in `scss` and organised in an [ITCSS](https://www.creativebloq.com/web-design/manage-large-css-projects-itcss-101517528) and [BEM](http://getbem.com/) - inspired way by default, including some boilerplate css elements I find useful.

More customisation can be made tp the build process in the `/webpack/` directory.

Modernizr and babel/es6 are configured by default.

Page title and meta description can be set globally within the `/data/meta.json` file, or by overriding those variables in a pages' markdown frontmatter.

Layouts are stored in `/layouts`, the layout can also be set using frontmatter with the `layout` variable. Check out `/src/content/index.md` for an example.

Happy hunting!
