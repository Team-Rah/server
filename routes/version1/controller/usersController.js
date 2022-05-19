const {getAllUser, getSingleUser, editUser, deleteUser, createUser, getSingleUserById} = require('../../../database/controller/users');
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
    getSingleUser: async(req, res, next) => {
        try {
            const user = await getSingleUserById(req.user.id)
            let jwtToken = await createJwtToken(user);
            res.json({
                message: "Successfull",
                user
            });
        }
        catch(err) {
            next(err);
        }
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
          let user = await getSingleUser(email, true);
          await comparePassword(password, user.password);

          let jwtToken = await createJwtToken(user);
          return res.json({
            message: "Successfully logged in",
            token: jwtToken,
            user,
          });
        } catch (err) {
            next(err);
        }

    },
    toggleFriend: async(req, res, next) => {
        const {user_id} = req.body;
        try {
            let user = await getSingleUserById(req.user.id);
            let friends = [...user.friends];
            if (!friends.includes(user_id)) {
                friends.push(user_id);
                user.friends = friends;
                let savedUser = await editUser(user)
                return res.json({
                    message: "Successfully add",
                    friends : savedUser.friends
                    });
            } else {
                friends.splice(friends.indexOf(user_id),1);
                user.friends = friends;
                let savedUser = await editUser(user)
                return res.json({
                    message: "Successfully removed",
                    friends : savedUser.friends
                    });
            }
        } catch (err) {
            next(err);
        }
    },
};