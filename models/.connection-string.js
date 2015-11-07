// place connection string here
// e.g. var uri = 'mongodb://andy:corn@ds051334.mongolab.com:51334/cli';
// or   var uri = config.get('mongo');
var uri = '';
if (!uri) throw new Error('You need to provide the connection string. Open "models/.connection-string.js" and export it.');
module.exports = uri;
