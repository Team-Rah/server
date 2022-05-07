var express = require('express');
var router = express.Router();
const userRoutes = require('./users');
const gamesRouter = require('./games')

router.use('/users', userRoutes);
router.use('/games' , gamesRouter);

module.exports = router;