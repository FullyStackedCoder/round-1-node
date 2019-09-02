const express = require('express');

const patchController = require('../controllers/patch');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/patch', isAuth, patchController.patch);

module.exports = router;
