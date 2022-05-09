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
    login: async(req, res, next) => {
        const { email, password } = await req.body;
        try {
          let user = await getSingleUser(email);
        //   if (!user) {
        //     return res.status(500).json({
        //       status: "error",
        //       message: "User Not Found",
        //     });
        //   }

        //   let comparedPassword = await comparePassword(password, user.password);
        //   if (comparedPassword === 409) {
        //     return res.status(409).json({
        //       status: "error",
        //       message: "Check your email and password",
        //     });
        //   }
      
        //   let jwtToken = await createJwtToken(user);
        //   return res.status(200).json({
        //     status: "success",
        //     message: "Successfully logged in",
        //     token: jwtToken,
        //     user: user._id,
        //     profilePic: user.profilePic,
        //   });
        } catch (err) {
        //   return res.status(500).json({
        //     status: "error",
        //     message: error.message,
        //   });
        next(err);
        }

    },
};