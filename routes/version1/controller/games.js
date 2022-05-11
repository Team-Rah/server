const {createGame} = require('../../../database/controller/games');
const { createJwtToken } = require('../../../middleware/jwt');


module.exports = {
    createGame: async(req, res, next) => {
        try {
            const users = await getAllUser();
            res.json({
                message: 'Success',
                users
            });
        }
        catch(err) {
            next(err);
        }
    },
};