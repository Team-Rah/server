var express = require('express');
var router = express.Router();
const version1Route = require('./version1/index')

router.use('/blueocean/api/v1', version1Route);

module.exports = router;
