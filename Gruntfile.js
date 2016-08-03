module.exports = function(grunt) {
  require("load-grunt-tasks")(grunt);
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    jshint: {
      files: ["Gruntfile.js", "core/**/*.js", "lib/**/*.js"],
      options: {
        browser: true,
        globals: {
          chrome: false
        },
        esversion: 6
      },
    },
    jscs: {
      files: ["Gruntfile.js", "core/**/*.js", "lib/**/*.js"],
      options: {
        preset: "google",
        validateQuoteMarks: "\"",
        maximumLineLength: false,
        fix: true,
        requireCamelCaseOrUpperCaseIdentifiers: {
          ignoreProperties: true
        }
      }
    }
  });
};
