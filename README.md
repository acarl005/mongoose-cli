# mongoose-model-cli

A handy CLI for speeding up mongoose-related workflow. Generate model and migration files automatically, use either of two shells, and seed data.

### Get started 
```
npm install -g mongoose-model-cli
```
This will give you the `mongoose` command. Type that to get the help page. 

### 1. Make your first model with:
  ```
  mongoose generate model user name:string age:number foods:array
  ```
  Other mongoose schema types are also possible.
  ```
  mongoose generate model user name:string notes:mixed houseId:id
  ```
  Models will have createdAt and updatedAt fields already implemented.

### 2. Set the Mongo URI
  ```
  mongoose setUri 'mongodb://andy:corn@localhost:27017/cli'
  ```
  Now you can save to your DB, seed it, drop it, and probe it with one of the shells.

### 3. Use these commands
**help:**  Provides details for a command

**seed:**  Runs the seed file in ./models/seed

**drop:**  Drops some or all of the collections

**generate:**  Creates a model or migration file

**shell:**  Opens a native MongoDB shell

**mshell:**  Opens a Node.js shell using mongoose methods

### 4. Easily connect to MongoDB and require models!
You can require the models individually, or just require them all like so:
```javascript
var models = require('./models/all-models');
```
This brings them in an an object. You can also place them all on the global scope like this:
```javascript
require('../all-models').toContext(global);
```
No need to use `mongoose.connect` anymore. That is done automatically when any of the models is required. Only one connection is made if multiple models are required.

## Docs

#### Getting help
```
mongoose help [command name]
```
Get details for a command.

#### Initializing project
```
mongoose init
```
Generates files and directory structure (triggered automatically when a model is generated).

#### Setting MongoDB URI
```
mongoose setUri <uri>
```
Tells mongoose where the MongoDB is. Give it a mongo connection string, e.g. `mongodb://andy:corn@localhost:27017/cli`. If you need to dynamically determine the URI (e.g. have it depend on an enviroment variable), then you should directly edit the `models/connection-string.js` file instead.

#### Creating models
```
mongoose generate model <model name> [atribute:dataType pairs]
```
```bash
# JavaScript data types
mongoose generate model user name:string age:number likedFoods:array birth:date
# other mongoose types
mongoose generate model user name:string notes:mixed houseId:id
# specify an ID that references another model
mongoose generate model user name:string houseId:id-house
# get an encrypted field
mongoose generate model user name:string password:encrypted
```
##### Example
Running this command:
```
mongoose generate model user name:string age:number notes:mixed houseId:id-house
```
generates this model file called `User.js`:
```javascript
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
if (mongoose.connection.readyState === 0) {
  mongoose.connect(require('./connection-string'));
}

var newSchema = new Schema({
  
  'name': { type: String },
  'age': { type: Number },
  'notes': { type: Schema.Types.Mixed },
  'houseId': { type: Schema.Types.ObjectId, ref: 'House' },
  'createdAt': { type: Date, default: Date.now },
  'updatedAt': { type: Date, default: Date.now }
});

newSchema.pre('save', function(next){
  this.updatedAt = Date.now();
  next();
});

newSchema.pre('update', function() {
  this.update({}, { $set: { updatedAt: new Date() } });
});

module.exports = mongoose.model('User', newSchema);

```
The `createdAt` and `updatedAt` fields are generated automatically with the appropriate hooks.

#### Seeding data
```
mongoose seed
```
After initializing the project, thee will be a `models/seed/seedfile.js` that has all the models required automatically. Place DB insertions there and run the command to seed the database.

#### Migrations
```
mongoose generate migration <model name>
```
MongoDB doesn't technically need migrations since the schema is in the application layer. However, if similar operations need to be done on many documents in a collection, a migration file is a convenient place to do that. These files are just scripts with the model required in them. 
```javascript
var mongoose = require('mongoose');
var User = require('../User.js');


// manipulate your data here
User.find().exec()
.then(results => {
  console.log(results);
  mongoose.connection.close();
});
```
Once generated and editted, they need to be run manually, e.g. `node models/migrations/User-1447177237834.js`.

#### Shells for interacting with the data
You have two options:
```
mongoose shell
mongoose mshell
```
The "shell" uses the native mongo query lanuage. The "mshell" uses the mongoose API. You can use whichever of the two you are more familiar with. However, be sure to account for the asynchronicity of the mongoose methods.
```javascript
mongoose> User.create([{name: 'andy', age:24}, {name:'alex', age:23}])
mongoose> User.find({}, console.log)
/*
null [ { createdAt: Tue Nov 10 2015 09:44:40 GMT-0800 (PST),
    updatedAt: Tue Nov 10 2015 09:44:40 GMT-0800 (PST),
    __v: 0,
    age: 24,
    name: 'andy',
    _id: 56422d08867b9c3d13015a91 },
  { createdAt: Tue Nov 10 2015 09:44:40 GMT-0800 (PST),
    updatedAt: Tue Nov 10 2015 09:44:40 GMT-0800 (PST),
    __v: 0,
    age: 23,
    name: 'alex',
    _id: 56422d08867b9c3d13015a92 } ]
*/
```

#### Drop collections
```
mongoose drop [model names]
```
Use this command to empty a collection or several. Drop all collections with no arguments.