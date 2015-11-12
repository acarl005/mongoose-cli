var fs = require('fs');
var root = __dirname + '/../';

// build up the directory structure
module.exports = function init() {
  var dir = fs.readdirSync('./');
  var modelDir = dir.indexOf('models');
  if (modelDir !== -1) return;
  fs.mkdirSync('./models');
  fs.mkdirSync('./models/seed');
  fs.mkdirSync('./models/migrations');
  this.setUri('');
  fs.createReadStream(root + 'templates/seedfile.js').pipe(fs.createWriteStream('models/seed/seedfile.js'));
  fs.createReadStream(root + 'templates/dropfile.js').pipe(fs.createWriteStream('models/seed/dropfile.js'));
  fs.createReadStream(root + 'templates/repl.js').pipe(fs.createWriteStream('models/seed/repl.js'));
  fs.createReadStream(root + 'templates/all-models.js').pipe(fs.createWriteStream('models/all-models.js'));
}