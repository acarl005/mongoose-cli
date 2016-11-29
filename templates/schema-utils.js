var bcrypt = require('bcrypt-nodejs');

var SchemaUtils = {
  createEncryptedFieldsHooksAndMethods: function(fieldNames, schema) {
    fieldNames.forEach(function(fieldName) {
      schema.methods[fieldName + 'Compare'] = function compareEncryptedFields(attempt, next) {
        var fieldValue = this[fieldName];
        bcrypt.compare(attempt, fieldValue, function(err, isMatch) {
          if (err) return next(err);
          next(null, isMatch);
        });
      };

      schema.pre('save', function secureFieldsEncryptionOnSaveHook(next) {
        var record = this;
        // only hash if it has been modified (or is new)
        if (record.isModified(fieldName)) {
          // hash the password using our new salt
          bcrypt.hash(record[fieldName], null, null, function(err, hash) {
            if (err) return next(err);
            record[fieldName] = hash;
            next();
          });
        } else {
          next();
        }
      });
    });
  }
};

module.exports = SchemaUtils;