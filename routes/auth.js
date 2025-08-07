var express = require('express');
var router = express.Router();
var authCtrl = require('../controllers/auth')

/* GET home page. */

router.post('/swap-token', authCtrl.swapToken);

router.post('/refresh-token', authCtrl.refreshToken);

module.exports = router;