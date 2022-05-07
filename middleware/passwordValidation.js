const bcrypt = require('bcryptjs');

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
          return 409;
        }
      } catch (error) {
        return error;
      }
    },
}