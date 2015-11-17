var fs = require('fs');
var ejs = require('ejs');
var root = __dirname + '/../';


module.exports = function model(name) {

  if (!name) return console.bgRed('Must supply a name for the model.');
  name = name.pascal();
  var attrs = [].slice.call(arguments, 1);
  var secureAttrs = [];
  attrs = parseAttrs(attrs, secureAttrs);

  this.parent.init();
  console.cyan(`Creating new model: ${name}`);

  var file = ejs.render(
    fs.readFileSync(root + 'templates/model.ejs', 'utf-8'), 
    { name, attrs, secureAttrs, secure: secureAttrs.length }
  );

  fs.writeFileSync(`models/${name}.js`, file);
  console.green(name + ' was successfully created!');
}

function parseAttrs(attrs, secureAttrs) {
  attrs = attrs.reduce((obj, pair) => {
    pair = pair.split(':');
    obj[pair[0]] = pair[1].pascal();
    return obj;
  }, {});

  for (var attr in attrs) {
    var dataType = attrs[attr];
    if (dataType.slice(0, 2) === 'Id') {
      attrs[attr] = `Schema.Types.ObjectId, ref: '${dataType.slice(2)}'`;
    } 
    else if (dataType === 'Mixed') {
      attrs[attr] = `Schema.Types.Mixed`;
    }
    else if (dataType === 'Encrypted') {
      attrs[attr] = 'String';
      secureAttrs.push(attr);
    }
    else if (!global[dataType]) {
      throw new Error('\033[31m Invalid Data Type: \033[0m' + dataType);
    }
  }
  return attrs;
}
