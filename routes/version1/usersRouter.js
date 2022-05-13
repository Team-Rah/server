const express = require('express');
const router = express.Router();
const {authenticateToken} = require('../../middleware/jwt')
const {getAllUser, getSingleUser, editUser, deleteUser, createUser, login, toggleFriend} = require('./controller/usersController');
const {signupValidation} = require ('../../middleware/signupValidation.js');
/* GET users listing. */
router.get('/', getAllUser);
router.post('/', signupValidation, createUser);
router.put('/', authenticateToken, editUser);
router.delete('/', authenticateToken, deleteUser);
router.post('/login', login);
router.put('/togglefriend', authenticateToken, toggleFriend);

//might need
router.get('/friend', authenticateToken, getSingleUser);



module.exports = router;

