const express = require('express');
const router = express.Router();
const {} = require('./controller/games')



router.post('/', function(req, res, next) {
    res.send('respond with games');
  });
  
  router.put('/', function(req, res, next) {
    res.send('respond with games');
  });

module.exports = router;
