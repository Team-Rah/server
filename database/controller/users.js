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
            const user = await User.findOne({email}).populate("friends").lean();
            if (!user) {
                throw error(404,'USER NOT FOUND', at);
            }
            return user;
        }
        catch (err) {
            throw err;
        }
    },
    getSingleUserById: async(id,boolean) => {
        try {
            const user = await User.findById(id).populate(boolean? "friends" : '').lean();
            if (!user) {
                throw error(404,'USER NOT FOUND', at);
            }
            return user;
        }
        catch (err) {
            throw err;
        }
    },
    editUser: async(user) => {
        try {
          const editUser = await User.findByIdAndUpdate(user._id, user, {new: true}).populate("friends");
          return editUser
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