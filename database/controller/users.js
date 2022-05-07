module.exports = {
    getAllUser: async() => {
        const users = await Users.find();
        return users;
    },
    getSingleUser: async(id) => {
      const getUser = await Users.findbyid(id);
      return user
    },
    editUser: async(id, user) => {
      const editUser = await Users.findByIdAndUpdate(id, update);
      return editUser
    },
    deleteUser: async(id) => {
      const deleteUser = await Users.findByIdAndRemove();
      return user
    },
    createUser: async(info) => {
        const createUser = new Users(info);
        return user.save();
    }
};