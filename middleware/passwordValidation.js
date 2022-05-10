const bcrypt = require('bcryptjs');
const {error} = require('../errorHandler/errorHandler')

module.exports = {
  comparePassword: async (incomingPassword, userPassword) => {
    try {
      let comparedPassword = await bcrypt.compare(
        incomingPassword,
        userPassword
      );
      if (comparedPassword) {
        return comparedPassword;
      } else {
        throw error(409,'Check your email and password', 'middleware/passwordValidation');
      }
    } catch (err) {
      throw err;
    }
  },
};