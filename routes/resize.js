const express = require('express');

const resizeController = require('../controllers/resize');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/resize', isAuth, resizeController.resize);

module.exports = router;
