var app = require('../bin/mongoose-model-cli');
var expect = require('chai').expect;
var fs = require('fs');
var mongoose = require('mongoose');
var exec = require('child_process').exec;
var uri = 'mongodb://andy:corn@ds051334.mongolab.com:51334/cli';

describe('mongoose-model-cli', function() {

  after(function() {
    deleteFolderRecursive('./models');
  });

  describe('generate model', function() {

    it('generates the "models" directory', function() {
      app.generate.model('user', 'name:string');
      expect(fs.readdirSync('./models')).to.have.length(4);
    });

    it('makes a model file with a string attribute', function() {
      expect(fs.readFileSync('./models/User.js', 'utf-8')).to.match(/'name': { type: String },/);
    });

    it('makes a model file with several attributes', function() {
      app.generate.model('user', 'name:string', 'age:number', 'notes:mixed');
      expect(fs.readFileSync('./models/User.js', 'utf-8')).to.match(/'age': { type: Number },/);
      expect(fs.readFileSync('./models/User.js', 'utf-8')).to.match(/'notes': { type: Schema\.Types\.Mixed },/);
    });

    it('makes a model file with an association', function() {
      app.generate.model('user', 'name:string', 'age:number', 'houseId:id-house');
      expect(fs.readFileSync('./models/User.js', 'utf-8')).to.match(/'houseId': { type: Schema\.Types\.ObjectId, ref: 'House' },/);
    });
    
  });

  describe('persisting the models', function() {


    function connectToMongo(done) {
      console.log("Connecting to MongoDB...");
      if (!mongoose.connection.readyState) 
        mongoose.connect(uri);
      if (mongoose.connection.readyState === 1)
        return done();
      setTimeout(function() {
        connectToMongo(done);
      }, 1000);
    }

    before(connectToMongo);

    it('should save to mongo', function(done) {
      var User = require('../models/User.js');
      User.create([
        { name: 'andy', age: 24 },
        { name: 'alex', age: 23 },
      ], function(err, res) {
        if (err) throw err;
        expect(res).to.have.length(2);
        expect(res[0]).to.have.property('name');
        done();
      });
    });

    it('should drop the users', function(done) {
      var User = require('../models/User.js');
      app.setUri(uri);
      exec('node ./models/seed/dropfile.js User', function(err, stdout, stderr) {
        if (err) throw err;
        User.count(function(err, num) {
          expect(num).to.eql(0);
          done();
        });
      });
    });

  });

});



var deleteFolderRecursive = function(path) {
  if(fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};