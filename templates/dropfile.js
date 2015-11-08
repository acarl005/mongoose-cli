var fs = require('fs');
var mongoose = require('mongoose');


// require all models in the 'models' directory
var names = fs.readdirSync('./models');
var models = {};
names.forEach(name => {
  if (!name.match(/\.js$/)) return;
  if (name === 'connection-string.js') return;
  var model = require('../' + name);
  models[model.modelName] = model;
});

var args = process.argv.slice(2);
var state = { count: 0 };
if (!args.length) {
  state.total = Object.keys(models).length;
  for (var name in models) {
    models[name].remove({}, () => {
      state.count++;
    });
  }
} else {
  state.total = args.length;
  args.forEach(name => {
    models[name].remove({}, () => {
      state.count++;
    });
  });
}


checkIfDone();
function checkIfDone() {
  if (state.total === state.count) {
    console.log("Drop complete!");
    return mongoose.connection.close();
  }
  setTimeout(checkIfDone, 500);
}