const fs = require('fs');
const path = require('path');

const request = require('request');

module.exports = (uri, filename, cb) => {
  try {
    request.head(uri, function(err, res, body){
      if (err) {
        console.log(err);
      }
      // eslint-disable-next-line max-len
      request(uri).pipe(fs.createWriteStream(path.join(__dirname, '../images', filename))).on('close', cb);
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};
