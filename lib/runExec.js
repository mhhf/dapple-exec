"use strict";
var docopt = require("docopt");
var web3 = require("web3");

module.exports = (cmd, params, state) => {
  if(!(cmd in state._global_state.exec)) {
    console.log(`ERROR: ${cmd} is not known.`);
    return null;
  }
  var obj = state._global_state.exec[cmd];

  console.log([cmd].concat(params));

  var cli = docopt.docopt("Usage: \n"+obj.cliO, {
    help: false,
    argv: (params)
  });

  var abi = JSON.parse(obj.classObj.interface);
  var fabi = abi.find(i => i.type === "function" && cli[i.name]);
  console.log(fabi);
  //TODO - use wevm for this... maybe iface
  //       but simulate first!

}
