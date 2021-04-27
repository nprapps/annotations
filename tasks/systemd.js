module.exports = function(grunt) {
  var os = require("os");
  var path = require("path");

  grunt.registerTask("systemd", "Generate a valid systemd service file", function() {

    console.log("s");

    var template = grunt.file.read("tasks/lib/annotation.service.template");
    var env = {
      GOOGLE_OAUTH_CLIENT_ID: null,
      GOOGLE_OAUTH_CONSUMER_SECRET: null,
      NODE_VERSION: 12
    }
    for (var v in env) {
      if (env[v] === null) {
        env[v] = process.env[v];
      }
    }

    var home = os.homedir();
    var here = process.cwd();

    var data = { home, here, env };

    var output = grunt.template.process(template, data);

    grunt.file.write("annotation.service", output);

  });
};