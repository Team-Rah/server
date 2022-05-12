const express = require('express');
const router = express.Router();
const {authenticateToken} = require('../../middleware/jwt')
const {createGame, getSingleGame} = require('./controller/gamesController')



router.post('/', authenticateToken, createGame)
router.get('/single', getSingleGame)

module.exports = router;
