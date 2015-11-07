var fs = require('fs');
var mongoose = require('mongoose');


// require all models in the 'models' directory
var names = fs.readdirSync('./models');
names.forEach(name => {
  if (!name.match(/\.js$/)) return;
  var model = require('./models/' + name);
  global[model.modelName] = model;
});



// suggested module for generating fake contextual data
var Faker = require('faker');


// For Example

CoolUser.create([
  { name: 'andy', age: 24 },
  { name: 'alex', age: 23 },
  { name: Faker.name.firstName(), age: Faker.random.number() }
])

.then(() => {
  mongoose.connection.close();
});

// be sure to close the connection once the queries are done

