const {createGame} = require('../../../database/controller/games');
const { createJwtToken } = require('../../../middleware/jwt');



module.exports = {
    createGame: async(req, res, next) => {
        try {
            const game = req.body;
            const newGame = await createGame(game);
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