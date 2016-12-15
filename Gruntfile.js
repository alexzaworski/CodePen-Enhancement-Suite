module.exports = function(grunt) {
  require("load-grunt-tasks")(grunt);
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    jshint: {
      files: ["Gruntfile.js", "ces/**/*.js"],
      options: {
        browser: true,
        globals: {
          chrome: false
        },
        esversion: 6
      },
    },
    jscs: {
      files: ["Gruntfile.js", "ces/**/*.js"],
      options: {
        preset: "google",
        validateQuoteMarks: "\"",
        maximumLineLength: false,
        fix: true,
        disallowSpacesInsideBrackets: true,
        requireCamelCaseOrUpperCaseIdentifiers: {
          ignoreProperties: true
        }
      }
    },
    compress: {
      zip: {
        options: {
          archive: "ces.zip"
        },
        files: [{
          expand: true,
          cwd: "ces",
          src: ["**/*"],
        }]
      }
    }
  });
};
