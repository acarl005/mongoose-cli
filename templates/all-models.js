var fs = require('fs');

//require all the models 
var models = {};
var names = fs.readdirSync('./models');
var utilityFiles = ['connection-string.js', 'all-models.js', 'schema-utils.js'];

names.forEach(name => {
  if (!name.match(/\.js$/)) return;
  if (utilityFiles.indexOf(name) >= 0) return;
  var model = require('./' + name);
  models[model.modelName] = model;
});

// define non-enumerable method to place each model onto an object. primarily for making them global
Object.defineProperty(models.__proto__, 'toContext', {
  enumerable: false,
  value: function(context) {
    for (var name in this) {
      context[name] = this[name]; 
    }
    return context;
  }
});
 

module.exports = models;