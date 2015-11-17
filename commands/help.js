module.exports = function help(command) {

  switch(command) {

    case 'setUri':
      console.log(`
${'setUri command'.blue.underline}
${'"mongoose setUri <mongo uri>"'.green}

Example:
${'"mongoose setUri \'mongodb://andy:corn@ds051334.mongolab.com:51334/cli\'"'.green}

Sets the connection string to enable mongoose to connect to MongoDB. If you need to dynamically determine \
the URI ${'(like depending on the ENV)'.gray}, then you should directly edit the ${'models/connection-string.js'.yellow} file instead.
      `); break;

    case 'seed':
      console.log(`
${'seed command'.blue.underline}

Edit the ${'models/seed/seedfile.js'.yellow}. All models are automatically required. Run the command to execute the seed file.
      `); break;

    case 'drop':
      console.log(`
${'drop command'.blue.underline}
${'"mongoose drop [model names]"'.green}

Drop all collections:
${'"mongoose drop"'.green}

Drop the user and comment collections
${'"mongoose drop user comment"'.green}

Empties some or all the collections in the database.
      `); break;

    case 'generate':
    case 'g':
    case 'create':
      console.log(`
${'generate command'.blue.underline}
${'"mongoose generate model <modelName> [attribute:dataType pairs]"'.green}
${'"mongoose generate migration <modelName>"'.green}

Aliases:
${'g, create'.cyan}

Create new model:
${'built-in data types'.grey}
${'"mongoose generate model user name:string age:number likedFoods:array birth:date"'.green}
${'other mongoose types'.grey}
${'"mongoose generate model user name:string notes:mixed houseId:id"'.green}
${'with a reference to another model'.grey}
${'"mongoose generate model user name:string houseId:id-house"'.green}
${'with an encrypted field'.grey}
${'"mongoose generate model user name:string password:encrypted"'.green}

Create new migration:
${'"mongoose generate migration user"'.green}
      `); break;

    case 'shell':
      console.log(`
${'shell command'.blue.underline}

Native MongoDB shell. Use the native mongo query language.
${'db.users.find({})'.green}
      `); break;

    case 'mshell':
      console.log(`
${'mshell command'.blue.underline}

A JavaScript REPL with all the models required. Use the mongoose methods. Remember to handle asynchronicity.
${'User.find({}, console.log)'.green} ${'// logs all the user objects'.grey}
      `); break;

    default: 
      console.log(`\

${'Welcome to mongoose-model-cli!'.yellow}

${'Commands'.blue.underline}
${'help:'.cyan}  Provides details for a command
${'init:'.cyan}  Generates directory structure
${'setUri:'.cyan}  Sets the connection string for connecting to MongoDB
${'seed:'.cyan}  Runs the seed file in ./models/seed
${'drop:'.cyan}  Drops some or all of the collections
${'generate:'.cyan}  Creates a model or migration file
${'shell:'.cyan}  Opens a native MongoDB shell
${'mshell:'.cyan}  Opens a Node.js shell using mongoose methods

For more info try ${'"mongoose help generate"'.green}
      `);
  }
}
