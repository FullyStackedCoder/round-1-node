const jsonpatch = require('jsonpatch');

exports.patch = async(req, res, next) => {
  try {
    const { mydoc, thepatch } = req.body;
    // Throw error if we did not recieve either mydoc or thepatch
    if (!mydoc || !thepatch) {
      const error = new Error('Input is not valid.');
      error.statusCode = 422;
      // eslint-disable-next-line max-len
      error.message = 'You should pass both mydoc and thepatch with your request.';
      throw error;
    }
    // Throw error if the req.body object contains more than 2 keys
    if (Object.keys(req.body).length > 2) {
      const error = new Error('Input is not valid.');
      error.statusCode = 422;
      error.message = 'Your request body should contain only 2 keys.';
      throw error;
    }
    // Do the patching
    const patchedDoc = await jsonpatch.apply_patch(mydoc, thepatch);
    res.status(200).json({
      patchedDoc,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
