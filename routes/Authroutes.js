const express = require('express');
const { getAllUsers, RegisterUsers, LoginUser } = require('../controllers/Controllers');


const router = express.Router();

router.get('/getData', getAllUsers);
router.post('/register', RegisterUsers);
router.post('/login',LoginUser)

module.exports = router;
