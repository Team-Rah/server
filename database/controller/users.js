const User = require('../models/User');


module.exports = {
    getAllUser: async() => {
        try {  
            const users = await User.find();
            return users;
        }
        catch (err) {
            throw Error(err);
        }

    },
    getSingleUser: async() => {
        
    },
    editUser: async() => {

    },
    deleteUser: async() => {

    },
    createUser: async(user) => {
        try {  
            const createUser = await User(user);
            const savedUser = await createUser.save();
            return savedUser;
        }
        catch (err) {
            throw Error(err);
        }
    },
};