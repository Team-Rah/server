const {getAllUser, getSingleUser, editUser, deleteUser, createUser} = require('../../../database/controller/users')

module.exports = {
    getAllUser: async(req, res) => {
        try {
            const users = await getAllUser();
            res.status(200).json({
                message: 'Success',
                users
            });
        }
        catch(err) {
            res.status.json({
                message: 'error',
                err
            });
        }

    },
    getSingleUser: async(req, res) => {

    },
    editUser: async(req, res) => {

    },
    deleteUser: async(req, res) => {

    },
    createUser: async(req, res) => {

    },
    login: async(req, res) => {

    },
}