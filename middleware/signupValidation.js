var passwordValidator = require('password-validator');
const {error} = require ('../errorHandler/errorHandler');
const at = 'MIDDLEWARE/SIGNUPVALIDATION'
var schema = new passwordValidator();
var userNameCheck = new passwordValidator();

schema
.is().min(5)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits(2)                                // Must have at least 2 digits
.has().not().spaces()                           // has spaces
.has().symbols();                               // has symbols

userNameCheck
.is().min(5);



module.exports = {
  signupValidation: (req, res, next) => {
    try{

      if(!userNameCheck.validate(req.body.userName)) {
        throw error(400, 'USERNAME INVALID', at);
      }

      if(!schema.validate(req.body.password)) {
        throw error(400, 'PASSWORD INVALID', at);
      }

      if(!req.body.email.includes('@')) {
        throw error(400, 'EMAIL INVALID', at);
      }
      
      next();
    }
    catch(err){
      throw err;
    }
  }
};

