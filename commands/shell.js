var spawn = require('child_process').spawn;
var repl = require('repl');

module.exports = function shell() {
  try {
    var uri = require(process.cwd() + '/models/connection-string');
  } catch(err) {
    console.red(err);
    return console.red("You need to provide the connection string. You can open 'models/connection-string.js' and export it or use the 'setUri' command.");
  }
  var cmd = uri.replace(/^mongodb:\/\/(\w+):(.*?)@(.*?):(\d+)\/(\w+)$/, "--host '$3'  --port '$4' -u '$1' -p '$2' $5");
  var cmd = uri.match(/^mongodb:\/\/(\w+):(.*?)@(.*?):(\d+)\/(\w+)$/);
  if (!cmd) return console.red('Improperly formatted URI');

  var shell = spawn('mongo', [cmd[5]], {
    host: cmd[3],
    port: cmd[4],
    username: cmd[1],
    password: cmd[2],
    encoding: 'utf-8'
  });

  var finishFunc;
  shell.stdout.pipe(process.stdout);
  shell.stderr.pipe(process.stderr);
  shell.stdout.on('data', function() {
    finishFunc && finishFunc();
  })

  repl.start({
    prompt: 'mongo> ',
    input: process.stdin,
    output: process.stdout,
    eval: function(input, global, mode, finish) {
      finishFunc = finish;
      shell.stdin.write(input);
    }
  });
}