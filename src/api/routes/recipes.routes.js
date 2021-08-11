const express = require('express');
const authenticatedUser = require('../middlewares/authenticatedUser');

const router = express.Router();
const RecipesControllers = require('../controllers/recipesControllers');

router.get('/', RecipesControllers.findAll);

router.post('/', authenticatedUser, RecipesControllers.create);

module.exports = router;
