const User = require('../models/User');
const {error} = require('../../errorHandler/errorHandler');
const at = 'DATABASE/CONTROLLER/USER';

module.exports = {
    getAllUser: async() => {
        try {
            const users = await User.find();
            return users;
        }
        catch (err) {
            throw err;
        }
    },
    getSingleUser: async(email) => {
        try {
            const user = await User.findOne({email});
            if (!user) {
                throw error(404,'USER NOT FOUND', at);
            }
            return user;
        }
        catch (err) {
            throw err;
        }
    },
    getSingleUserById: async(id) => {
        try {
            const user = await User.findById(id);
            if (!user) {
                throw error(404,'USER NOT FOUND', at);
            }
            return user;
        }
        catch (err) {
            throw err;
        }
    },
    editUser: async(id, user) => {
        try {
            // takes key value pairs as user to be updated
          const dataUpdated = await User.findByIdAndUpdate(id, user, {new: true});
          if (!dataUpdated) {
            throw error(404, 'USER CANT BE FOUND','/DATABASE/CONTROLLER/GAMES')
        }
        return dataUpdated
        }
        catch (err) {
            throw err;
        }
    },
    deleteUser: async(id) => {
      try {
        const deletedUser = await User.findByIdAndRemove(id);
        return 'deleted User';
      }
      catch (err) {
          throw err;
      }
    },
    createUser: async(user) => {
        try {
            const createUser = new User(user);
            const savedUser = await createUser.save();
            return savedUser;
        }
        catch (err) {
            throw err;
        }
    },
};