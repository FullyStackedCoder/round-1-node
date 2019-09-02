const jwt = require('jsonwebtoken');

const EXPIRES_IN = 60 * 60; // 1 hour
const SUPER_SECRET = 'Round 1 Node Code';

exports.login = async(req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      throw error;
    }
    const token = await jwt.sign(
      {
        username,
      },
      SUPER_SECRET,
      {
        expiresIn: EXPIRES_IN,
      }
    );
    res.status(200).json({
      token: token,
      expiresIn: EXPIRES_IN,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
