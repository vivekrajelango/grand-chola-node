const express = require('express');
const router = express.Router();
const {createUser} = require('../controllers/User.controller')

router.route('/create-user').post(createUser)

module.exports = router;