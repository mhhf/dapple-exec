"use strict";
// var userHome = require("user-home");
var path = require("path");

module.exports = (obj, state) => {
  var abi = JSON.parse(obj.classObj.interface);
  var caller = obj.cmd_name;
  var cliO = abi
    .filter( f => f.type === 'function' )
    .map( f => {
      let params = f.inputs.map( i => '<'+( i.name || i.type )+'>').join(' ');
      let doc = null;
      let paramDoc = "";
      // let doc = contract.doc.methods[f.name+'('+_.pluck( f.inputs, 'type' ).join(',')+')' ];
      // let paramDoc = _.map( doc && doc.params, 
                          //  (d, n) => '    '+n+':'+f.inputs.find( i => i.name === n ).type +' - '+d+'\n'
                          // ).join('');
      // return {
      //   functionCall: f.name,
      //   functionName: 
      // };
      return `  ${ caller } ${f.name } ${params } ${doc && '\n  '+doc.details || ''}\n${paramDoc}`;
    }).join("");
    obj.cliO = cliO;
    console.log(obj);
    if(!( "exec" in state._global_state)) state._global_state.exec = {};
    if( obj.cmd_name in state._global_state.exec ) {
      console.log(`Error: ${obj.cmd_name} is already known.`);
      return null;
    }
    

    state._global_state.exec[obj.cmd_name] = obj;
    state.saveGlobalState();

}
