var express = require('express');
var router = express.Router();
const {getAllUser, getSingleUser, editUser, deleteUser, createUser, login} = require('./controller/users');

/* GET users listing. */
router.get('/', getAllUser);
router.post('/', createUser);
router.put('/', editUser);
router.delete('/', deleteUser);
router.post('/login', login);

//might need
router.get('/:id', getSingleUser);


module.exports = router;
