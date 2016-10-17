var fs = require('fs');

var base64 = {
  // function to encode file data to base64 encoded string
  encode: function(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
  },
  // function to create file from base64 encoded string
  decode: function(base64str, file) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    var bitmap = new Buffer(base64str.replace(/^data:image\/(png|gif|jpeg);base64,/,''), 'base64');
    // write buffer to file
    fs.writeFileSync(file, bitmap);
  }
};
module.exports = base64;
