const express = require('express');
const router = express.Router();
const version1Route = require('./version1/v1');

router.use('/blueocean/api/v1', version1Route);

module.exports = router;
