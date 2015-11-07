var mongoose = require('mongoose');
var Schema = mongoose.Schema;
if (mongoose.connection.readyState === 0) {
  mongoose.connect(require('./.connection-string'));
}

var newSchema = new Schema({
  
  'name': { type: String },
  'age': { type: Number },
  'houseId': { type: Schema.Types.ObjectId, ref: 'House' },
  'notes': { type: Schema.Types.Mixed },
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

module.exports = mongoose.model('CoolUser', newSchema);
