var fs = require('fs');
var repl = require('repl');
var mongoose = require('mongoose');


// require all models in the 'models' directory
var names = fs.readdirSync('./models');
names.forEach(name => {
  if (!name.match(/\.js$/)) return;
  var model = require('../' + name);
  global[model.modelName] = model;
});

var shell = repl.start({
  prompt: 'mongoose> ',
  input: process.stdin,
  output: process.stdout,
  useColors: true,
});
