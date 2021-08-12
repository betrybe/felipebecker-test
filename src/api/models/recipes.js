const { ObjectId } = require('mongodb');
const { connection } = require('./conn');

const getRecipesCollection = async () => {
  const conn = await connection();
  return conn.collection('recipes');
};

const findAll = async () => {
  const recipes = await getRecipesCollection();
  return recipes.find().toArray();
};

const findById = async (id) => {
  const recipe = await getRecipesCollection();
  return recipe.findOne(ObjectId(id));
};

const create = async (recipe) => {
  const recipes = await getRecipesCollection();

  const { recipeId } = await recipes.insertOne(recipe);
  return { _id: recipeId, ...recipe };
};

module.exports = {
  findAll,
  findById,
  create,
};
