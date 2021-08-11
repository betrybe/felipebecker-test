const express = require('express');
const users = require('./users');
const login = require('./login');

const router = express.Router();

router.use('/users', users);
router.use('/login', login);

module.exports = router;
