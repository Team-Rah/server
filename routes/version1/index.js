const express = require('express');
const router = express.Router();
const userRoutes = require('./users');
const gamesRouter = require('./games')

router.use('/users', userRoutes);
router.use('/games' , gamesRouter);

module.exports = router;