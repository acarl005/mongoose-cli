var app = require('../bin/mongoose-model-cli');
var expect = require('chai').expect;
var fs = require('fs');
var mongoose = require('mongoose');
var exec = require('child_process').exec;
var uri = 'mongodb://andy:corn@localhost:27017/cli';

describe('mongoose-model-cli', function() {

  after(function() {
    deleteFolderRecursive('./models');
  });

  describe('generate model', function() {

    it('generates the "models" directory', function() {
      app.init();
      expect(fs.readdirSync('./models')).to.have.length(3);
    });

    it('generates a model', function() {
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
    var User;

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

    function setup(next) {
      app.setUri(uri);
      User = require('../models/User.js');
      next();
    }

    function dropUsers(done) {
      User.remove({}, function(err) {
        if (err) throw err;
        done();
      });
    }

    before(setup, connectToMongo, dropUsers);

    it('should save to mongo', function(done) {
      User.create([
        { name: 'andy', age: 24 },
        { name: 'alex', age: 24 },
      ], function(err, res) {
        if (err) throw err;
        expect(res).to.have.length(2);
        expect(res[0]).to.have.property('name');
        done();
      });
    });

    it('should retrieve the data', function(done) {
      User.find({}, function(err, data) {
        if (err) throw err;
        expect(data).to.have.length(2);
        expect(data[0]).to.be.a('object');
        expect(data[0]).to.have.property('name');
        expect(data[0]).to.have.property('age').and.eql(24);
        done();
      });
    });

    it('should drop the users', function(done) {
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