var fs = require('fs');
var ejs = require('ejs');
var root = __dirname + '/../';


module.exports = function migration(name) {
  if (!name) return console.red('You must specify the model for this migration');
  name = name.pascal();
  var models = fs.readdirSync('./models');

  // make sure this model exists
  var modelInd = models.indexOf(name + '.js');
  if (modelInd === -1) 
    return console.red('You have yet to create a model: ' + name);

  console.cyan('Creating a migration file for: ' + name);
  var file = ejs.render(fs.readFileSync(root + 'templates/migration.ejs', 'utf-8'), { name });

  fs.writeFileSync(`models/migrations/${name}-${Date.now()}.js`, file);
  console.green(`Migration for ${name} was successfully created!`);
}
