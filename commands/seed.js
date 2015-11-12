var exec = require('child_process').exec;

module.exports = function seed(cb) {
  exec('node ./models/seed/seedfile.js', function(err, stdout, stderr) {
    if (err) console.error(err);
    else console.log(stdout);
    cb && cb(err, stdout, stderr);
  });
}