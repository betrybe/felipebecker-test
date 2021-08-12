const RecipeModel = require('../models/recipes');
const RecipeSchema = require('../schemas/recipesSchema');
const AppError = require('../errors/appError');

const findAll = () => RecipeModel.findAll();

const findById = (id) => RecipeModel.findById(id);

const create = async (recipe) => {
  const { value, error } = RecipeSchema.validate(recipe);
  if (error) {
    throw new AppError('Invalid entries. Try again.', 400);
  }

  return RecipeModel.create(value);
};

const findOwnerRecipe = async (id) => {
  const recipeData = await findById(id);

  return recipeData;
};

const edit = async (id, recipe, role) => {
  const { error } = RecipeSchema.validate(recipe); 

  if (error) {
    throw new AppError('Invalid entries. Try again.', 400);
  }

  const response = await findOwnerRecipe(id);

  if (response.userId === recipe.userId || role === 'admin') { 
    return RecipeModel.edit(id, recipe); 
  } 
    throw new AppError('Invalid user. Permission denied to edit', 400);
};

module.exports = {
  findAll,
  findById,
  findOwnerRecipe,
  create,
  edit,
};
