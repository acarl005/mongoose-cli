var spawn = require('child_process').spawn;
var repl = require('repl');

module.exports = {
  shell: function () {

    var uri = require(process.cwd() + '/models/connection-string');
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
    });

    repl.start({
      prompt: 'mongo> ',
      input: process.stdin,
      output: process.stdout,
      useColors: true,
      eval: function(input, context, mode, finish) {
        finishFunc = finish;
        shell.stdin.write(input);
      }
    });

  },

  mshell: function mshell() {
    try {
      require(process.cwd() + '/models/seed/repl.js');
    }
    catch(err) {
      console.error(err);
    }
  }

}