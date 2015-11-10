# mongoose-model-cli

A handy CLI for speeding up mongoose-related workflow. Generate model and migration files automatically, use either of two shells, and seed data.

###Get started 
```
npm install -g mongoose-model-cli
```
This will give you the `mongoose` command. Type that to get the help page. 

###1. Make your first model with:
  ```
  mongoose generate model user name:string age:number foods:array
  ```
  Other mongoose schema types are also possible.
  ```
  mongoose generate model user name:string notes:mixed houseId:id
  ```
  Models will have createdAt and updatedAt fields already implemented.

###2. Set the Mongo URI
  ```
  mongoose setUri 'mongodb://andy:corn@localhost:27017/cli'
  ```
  Now you can save to your DB, seed it, drop it, and probe it with one of the shells.

###3. Use these commands
**help:**  Provides details for a command

**seed:**  Runs the seed file in ./models/seed

**drop:**  Drops some or all of the collections

**generate:**  Creates a model or migration file

**shell:**  Opens a native MongoDB shell

**mshell:**  Opens a Node.js shell using mongoose methods
