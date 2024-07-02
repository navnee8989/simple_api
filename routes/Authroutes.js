const express = require('express');
const { getAllUsers, RegisterUsers, LoginUser, addUserController } = require('../controllers/Controllers');


const router = express.Router();

router.get('/getData', getAllUsers);
router.post('/register', RegisterUsers);
router.post('/login',LoginUser)
// router.post('/adduser',addUserController)

module.exports = router;
