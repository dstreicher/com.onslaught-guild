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
      js: ['js/*.js']
    },
    paths: {
      index: 'index.template.html'
    }
  }
};

module.exports = config;
