module.exports = {
    getAllUser: async() => {
        const users = await Users.find();
        return users;
    },
    getSingleUser: async() => {
        
    },
    editUser: async() => {

    },
    deleteUser: async() => {

    },
    createUser: async() => {

    },
};