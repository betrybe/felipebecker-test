const RecipeModel = require('../models/recipes');
const RecipeSchema = require('../schemas/recipesSchema');
const AppError = require('../errors/appError');

const findAll = () => RecipeModel.findAll();

const create = async (recipe) => {
  const { value, error } = RecipeSchema.validate(recipe);
  if (error) {
    throw new AppError('Invalid entries. Try again.', 400);
  }

  return RecipeModel.create(value);
};

module.exports = {
  findAll,
  create,
};
