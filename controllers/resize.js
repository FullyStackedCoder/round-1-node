const fs = require('fs');
const path = require('path');

const uuid = require('uuid/v1');

const resize = require('../utils/resize');
const config = require('../config');

const rp = require('request-promise');

exports.resize = (req, res, next) => {

  const { imageUrl } = req.body;
  if (!imageUrl) {
    const error = new Error('Input is not valid.');
    error.statusCode = 422;
    error.message = 'No image URL provided.';
    throw error;
  }
  let supportedImageTypes = ['png', 'jpg', 'jpeg'];
  let splits = imageUrl.split('.');
  let imageType = splits[splits.length - 1].toLowerCase();
  if (!supportedImageTypes.includes(imageType)) {
    console.log(imageType);
    // eslint-disable-next-line max-len
    const error = new Error('Image type not supported. Supported types: jpeg, jpg, png');
    error.statusCode = 422;
    // eslint-disable-next-line max-len
    error.message = 'Image type not supported. Supported types: jpeg, jpg, png';
    throw error;
  }
  let filename = `${uuid()}.${imageType}`;
  const getImageOptions = {
    url: imageUrl,
    encoding: null,
    resolveWithFullResponse: true,
  };
  rp.get(getImageOptions)
    .then(response => {
      const buffer = Buffer.from(response.body, 'utf8');
      // eslint-disable-next-line max-len
      fs.writeFileSync(path.join(__dirname, '../images', `filename.${imageType}`), buffer);
      resize(`filename.${imageType}`, filename, () => {
        res.status(200).json({
          imageUrl: `http://localhost:${config.port}/images/${filename}`,
        });
      });
    })
    .catch((err) => {
      // fetching failed...
      const error = new Error('Error fetching image!');
      error.statusCode = err.statusCode;
      error.message = 'Error fetching image!';
      next(error);
    });
};
