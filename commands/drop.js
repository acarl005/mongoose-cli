var exec = require('child_process').exec;

module.exports = function drop() {
  var command = 'node ./models/seed/dropfile.js ';
  var args = [].map.call(arguments, name => name.pascal()).join(' ');
  exec(command + args, function(err, stdout, stderr) {
    if (err) console.error(err);
    else console.log(stdout);
  });
}