var fs = require('fs');
var root = __dirname + '/../';

// build up the directory structure
module.exports = function init() {
  var rootDir = fs.readdirSync('./');

  console.log('modelDir', rootDir);
  if (rootDir.indexOf('models') !== -1) {
    // check if it contains schema-utils.js and if not, then add it and also replace all-models.js
    var modelsDir = fs.readdirSync('./models');
    if (modelsDir.indexOf('schema-utils.js') === -1) {
      fs.createReadStream(root + 'templates/all-models.js').pipe(fs.createWriteStream('models/all-models.js'));
      fs.createReadStream(root + 'templates/schema-utils.js').pipe(fs.createWriteStream('models/schema-utils.js'));
    }
  } else {
    fs.mkdirSync('./models');
    fs.mkdirSync('./models/seed');
    fs.mkdirSync('./models/migrations');
    this.setUri('');
    fs.createReadStream(root + 'templates/seedfile.js').pipe(fs.createWriteStream('models/seed/seedfile.js'));
    fs.createReadStream(root + 'templates/dropfile.js').pipe(fs.createWriteStream('models/seed/dropfile.js'));
    fs.createReadStream(root + 'templates/repl.js').pipe(fs.createWriteStream('models/seed/repl.js'));
    fs.createReadStream(root + 'templates/all-models.js').pipe(fs.createWriteStream('models/all-models.js'));
    fs.createReadStream(root + 'templates/schema-utils.js').pipe(fs.createWriteStream('models/schema-utils.js'));
  }
}