var app = require('../bin/mongoose-model-cli');
var expect = require('chai').expect;
var fs = require('fs');
var mongoose = require('mongoose');
var Promise = require('bluebird');
mongoose.Promise = Promise;
var exec = require('child_process').exec;
var uri = 'mongodb://andy:corn@localhost:27017/cli';


describe('mongoose-model-cli', function() {

  after(function() {
    deleteFolderRecursive('./models');
  });

  describe('generate model', function() {

    it('"init" generates the "models" directory', function() {
      app.init();
      expect(fs.readdirSync('./models')).to.have.length(4);
    });

    it('generates a model', function() {
      app.generate.model('user', 'name:string', 'age:number');
      expect(fs.readdirSync('./models')).to.have.length(5);
    });

    it('makes a model file with a string attribute', function() {
      expect(fs.readFileSync('./models/User.js', 'utf-8')).to.match(/'name': { type: String },/);
    });

    it('makes a model file with several attributes', function() {
      app.generate.model('cool_user', 'name:string', 'age:number', 'notes:mixed');
      expect(fs.readdirSync('./models')).to.have.length(6);
      expect(fs.readFileSync('./models/CoolUser.js', 'utf-8')).to.match(/'age': { type: Number },/);
      expect(fs.readFileSync('./models/CoolUser.js', 'utf-8')).to.match(/'notes': { type: Schema\.Types\.Mixed },/);
    });

    it('makes a model file with an association', function() {
      app.generate.model('sick-user', 'name:string', 'age:number', 'houseId:id-house');
      expect(fs.readdirSync('./models')).to.have.length(7);
      expect(fs.readFileSync('./models/SickUser.js', 'utf-8')).to.match(/'houseId': { type: Schema\.Types\.ObjectId, ref: 'House' },/);
    });

  });

  describe('generate migration', function() {
    
    it('does not make migration file with invalid model', function() {
      app.generate.migration('nonsense');
      expect(fs.readdirSync('./models/migrations', 'utf-8')).to.have.length(0);
    });

    it('makes a migration file with valid model', function() {
      app.generate.migration('user');
      expect(fs.readdirSync('./models/migrations', 'utf-8')).to.have.length(1);
    });
    
  });

  describe('setUri', function() {
    it('throws errors when URI is not properly set', function() {
      expect(function() { require('../models/connection-string.js') }).to.throw(Error);
      app.setUri('nonsense');
      expect(function() { require('../models/connection-string.js') }).to.throw(Error);
      app.setUri(uri);
      expect(function() { require('../models/connection-string.js') }).to.not.throw(Error).and.eql(uri);
    });
  });

  describe('persisting the models', function() {

    function setup(done) {
      require('../models/all-models').toContext(global);
      Promise.all([
        User.remove({}),
        SickUser.remove({}),
        CoolUser.remove({}),
      ])
      .then(done.bind(this, null));
    }

    before(setup);

    it('should save users to mongo', function(done) {
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

    it('should seed SickUsers and CoolUsers', function(done) {
      var file = fs.readFileSync(__dirname + '/../models/seed/seedfile.js', 'utf-8');
      file += `
SickUser.create([
  { name: 'andy', age: 24 },
  { name: 'alex', age: 24 },
])

.then(() => {
  return CoolUser.create([
    { name: 'andy', age: 24 },
    { name: 'alex', age: 24 },
  ]);
})

.then(() => {
  mongoose.connection.close();
});
      `;
      fs.writeFileSync(__dirname + '/../models/seed/seedfile.js', file);
      app.seed(function() {
        Promise.all([
          CoolUser.count(),
          SickUser.count(),
        ])
        .then(function(res) {
          expect(res).to.eql([2, 2]);
          done();
        });
      });
    });

    it('should drop the user model', function(done) {
      exec('node ./models/seed/dropfile.js User', function(err, stdout, stderr) {
        if (err) throw err;
        User.count(function(err, num) {
          expect(num).to.eql(0);
          done();
        });
      });
    });

    it('should drop all models', function(done) {
      exec('node ./models/seed/dropfile.js', function(err, stdout, stderr) {
        if (err) throw err;
        Promise.all([
          CoolUser.count(),
          SickUser.count(),
          User.count(),
        ])
        .then(function(res) {
          expect(res).to.eql([0, 0, 0]);
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
      if(fs.lstatSync(curPath).isDirectory()) { 
        deleteFolderRecursive(curPath); // recurse
      } else { 
        fs.unlinkSync(curPath); // delete file
      }
    });
    fs.rmdirSync(path);
  }
};