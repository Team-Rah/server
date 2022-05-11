const express = require('express');
const router = express.Router();
const {authenticateToken} = require('../../middleware/jwt')
const {createGame} = require('./controller/gamesController')



router.post('/', authenticateToken, createGame)

module.exports = router;
