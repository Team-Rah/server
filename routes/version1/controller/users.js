const {getAllUser, getSingleUser, editUser, deleteUser, createUser} = require('../../../database/controller/users');
const { createJwtToken } = require('../../../middleware/jwt');
const {comparePassword} = require('../../../middleware/passwordValidation')

module.exports = {
    getAllUser: async(req, res, next) => {
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
    getSingleUser: async(req, res) => {
        
    },
    editUser: async(req, res) => {

    },
    deleteUser: async(req, res) => {

    },
    createUser: async(req, res, next) => {
        try {
            const user = await createUser(req.body)
            let jwtToken = await createJwtToken(user);
            res.json({
                message: "Successfully signed up",
                token: jwtToken,
                user
            });
        }
        catch(err) {
            next(err);
        }
    },
    login: async(req, res, next) => {
        const { email, password } = await req.body;
        try {
          let user = await getSingleUser(email);
          await comparePassword(password, user.password);

          let jwtToken = await createJwtToken(user);
          return res.status(200).json({
            message: "Successfully logged in",
            token: jwtToken,
            user,
          });
        } catch (err) {
            next(err);
        }

    },
};