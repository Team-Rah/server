const Game = require('../models/Game');
const {error} = require('../../errorHandler/errorHandler');
const at ='DATABASE/CONTROLLER/GAME';
module.exports = {
    getAllGames: async(filter) => {
        try {
            const games = await Game.find(filter);
            return games;
        }
        catch (err) {
            throw err;
        }
    },
    getSingleGame: async(id) => {
        try {
            const game = await Game.findById(id);
            if (!game) {
                throw error(404,'GAME NOT FOUND', at);
            }
            return game;
        }
        catch (err) {
            throw err;
        }
    },
    createGame: async(game) => {
        try {
            const createGame = await Game(game);
            const savedGame = await createGame.save();
            return savedGame;
        }
        catch (err) {
            throw err;
        }
    },
    editGame: async (game) => {
        try {
          const dataUpdated = await Game.findByIdAndUpdate(game._id, game, {new: true});
          if (!dataUpdated) {
              throw error(404, 'GAME CANT BE FOUND','/DATABASE/CONTROLLER/GAMES')
          }
          return dataUpdated;
        }
          catch (err) {
              throw err;
        }
      },
    updateGame: async (gameId, updatedObj) => {
        try {
            const updatedGame = await Game.updateOne({gameName: gameId}, updatedObj);
            return updatedGame;
        }
        catch (err) {
            throw err;
        }
    },

};