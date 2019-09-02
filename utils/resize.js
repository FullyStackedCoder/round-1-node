const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

module.exports = async(input, output, cb) => {
  // input stream
  let inStream = fs.createReadStream(path.join(__dirname, '../images', input));

  // output stream
  let outStream = fs.createWriteStream(path.join(__dirname, '../images',
    output), {flags: 'w'});

  // on error of output file being saved
  outStream.on('error', function() {
    throw Error;
  });

  // on success of output file being saved
  outStream.on('close', function() {
    clearImage(input);
    cb();
  });

  // input stream transformer
  // "info" event will be emitted on resize
  let transform = sharp()
    .resize({ width: 50, height: 50 })
    .on('info', function(fileInfo) {

    });

  await inStream.pipe(transform).pipe(outStream);
};

// Delete the input image file after we are done with
const clearImage = filePath => {
  filePath = path.join(__dirname, '../images', filePath);
  fs.unlink(filePath, err => {
    if (err) throw err;
  });
};
