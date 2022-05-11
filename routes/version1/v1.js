const express = require('express');
const router = express.Router();
const userRoutes = require('./usersRouter');
const gamesRouter = require('./gamesRouter');

router.use('/users', userRoutes);
router.use('/games' , gamesRouter);

module.exports = router;