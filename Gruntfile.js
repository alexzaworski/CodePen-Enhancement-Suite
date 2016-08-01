module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ["Gruntfile.js", "core/**/*.js", "lib/**/*.js"],
      options: {
        browser: true,
        globals: {
          chrome: false
        },
        esversion: 6
      },
    }
  });
};