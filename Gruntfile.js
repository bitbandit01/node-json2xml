module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    test: {
      files: ['test/**/*.js']
    }
  });

  // Default task.
  grunt.registerTask('default', ['test']);

};