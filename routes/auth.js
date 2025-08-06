var express = require('express');
var router = express.Router();
var authCtrl = require('../controllers/auth')

/* GET home page. */

router.post('/swap-token', authCtrl.swapToken);

router.post('/refresh-token', authCtrl.refreshToken);
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

module.exports = router;