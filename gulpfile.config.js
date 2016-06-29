var git = require('git-rev-sync');
var argv = require('yargs').argv;
var VERSION = argv.version || require('./package.json').version;
var TARGET = argv.dev ? 'dev' : 'prod';
var REVISION = git.short();

var config = {
  version: VERSION,
  target: TARGET,
  revision: REVISION,
  site: {
    src: 'src/',
    dest: 'dist/',
    globs: {
      css: ['css/*.css'],
      sprites: ['img/sprites/*.png'],
      images: ['img/*.{png,jpg,gif}'],
      js: ['js/*.js'],
      fonts: ['fonts/*.{eot,svg,ttf,woff,woff2}']
    },
    paths: {
      index: 'index.template.html'
    }
  },
  autoprefixer: {
    browsers: ['last 2 versions']
  }
};

module.exports = config;
