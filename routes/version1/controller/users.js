const {getAllUser, getSingleUser, editUser, deleteUser, createUser} = require('../../../database/controller/users');

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
            res.json({
                message: 'Success',
                user
            });
        }
        catch(err) {
            next(err);
        }
    },
    login: async(req, res) => {

    },
};