const express = require('express');
const router = express.Router();
const {authenticateToken} = require('../../middleware/jwt');
const {getAllUser, getSingleUser, editUser, deleteUser, createUser, login} = require('./controller/users');
const {signupValidation} = require ('../../middleware/signupValidation.js');

/* GET users listing. */
router.get('/', getAllUser);
router.post('/', signupValidation, createUser);
router.put('/', authenticateToken, editUser);
router.delete('/', authenticateToken, deleteUser);
router.post('/login', login);


//might need
router.get('/:id', getSingleUser);


module.exports = router;
