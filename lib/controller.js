"use strict";
var through = require("through2");
var createExec = require("./createExec.js");
var runExec = require("./runExec.js");

module.exports = {
  cli: function (state, cli, BuildPipeline) {
    if(cli.create) {
      let cmd_name = cli['<cmd_name>'];
      let contract_name = cli['<contract_object>'];
      let scriptname = cli['<cmd_name>'];
      var chainenv = state.state.pointers[state.state.head];
      // TODO - refactor build pipeline to own module
      BuildPipeline({
        modules: state.modules,
        optimize: !cli['--no-optimize'],
        packageRoot: state.workspace.package_root,
        subpackages: cli['--subpackages'] || cli['-s'],
        state
      })
      .pipe(through.obj(function (file, enc, cb) {
        if (file.basename === 'classes.json') {
          let classes = JSON.parse(String(file.contents));
          if(!(contract_name in chainenv.env)) {
            console.log(`ERROR: ${contract_name} is not known in your environment.`);
            return false;
          }
          let contract_object = chainenv.env[contract_name];
          let className = contract_object.type.split("[")[0];
          if(!(className in classes)) {
            console.log(`ERROR: ${className} is not a known contract type.`);
            return false;
          }
          let classObj = classes[className];
          createExec({
            cmd_name,
            classObj,
            address: contract_object.value,
            chainenv
          }, state);
        } else {
          cb();
        }
      }));
    } else if(cli.run) {
      var cmd = cli["<cmd>"];
      var params = cli["<params>"];
      runExec(cmd, params, state);
    }
  }
}
