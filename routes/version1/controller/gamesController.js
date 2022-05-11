const {createGame} = require('../../../database/controller/games');
const { createJwtToken } = require('../../../middleware/jwt');
const io = require('../../../socket.io/index.js');
const {error} = require ('../../../errorHandler/errorHandler.js');


module.exports = {
    createGame: async(req, res, next) => {

        try {
            const {gameName, players} = req.body;

            if (!gameName || !players) {
               throw error(400, 'MISSING GAMENAME OR PLAYER COUNT', 'routes/version1/constroller/gameController');
            }

            const game = {
                owner: req.user.id,
                gameName,
                playerAllowed: players,
                phase: 'pregame'
            }

            const newGame = await createGame(game);

            await io.emit('update-games-list', newGame);

            res.json({
                message: 'Successfully Created Game',
                newGame
            });
        }
        catch(err) {

            next(err);
        }
    },
};