var fs = require('fs');
var ejs = require('ejs');
var root = __dirname + '/../';


module.exports = function setUri(uri) {
  var file = ejs.render(fs.readFileSync(root + 'templates/connection-string.ejs', 'utf-8'), { uri });
  fs.writeFileSync('models/connection-string.js', file);
}