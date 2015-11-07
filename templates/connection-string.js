// place connection string here
// e.g. var uri = 'mongodb://andy:corn@ds051334.mongolab.com:51334/cli';
// or   var uri = config.get('mongo');
var uri = '';
if (!uri) throw new Error('\033[31mYou need to provide the connection string. \
Open "models/connection-string.js" and export it.\033[0m');
module.exports = uri;