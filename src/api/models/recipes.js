const { connection } = require('./conn');

const getRecipesCollection = async () => {
  const conn = await connection();
  return conn.collection('recipes');
};

const findAll = async () => {
  const recipes = await getRecipesCollection();
  return recipes.find().toArray();
};

const create = async (recipe) => {
  const recipes = await getRecipesCollection();

  const { recipeId } = await recipes.insertOne(recipe);
  return { _id: recipeId, ...recipe };
};

module.exports = {
  findAll,
  create,
};
