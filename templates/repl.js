var repl = require('repl');
var mongoose = require('mongoose');


// require all models in the 'models' directory
require('../all-models').toContext(global);

var shell = repl.start({
  prompt: 'mongoose> ',
  input: process.stdin,
  output: process.stdout,
  useColors: true,
});
