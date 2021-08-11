const express = require('express');

const router = express.Router();
const UsersControllers = require('../controllers/usersController');

router.get('/', UsersControllers.findAll);

router.post('/', UsersControllers.create);

module.exports = router;
