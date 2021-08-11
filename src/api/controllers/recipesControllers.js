const RecipesServices = require('../services/recipesService');

const findAll = (async (_request, response) => {
    const results = await RecipesServices.findAll();
    response.json(results);
});

const create = (async (request, response) => {
    const { name, ingredients, preparation } = request.body;
    const { _id } = request.user;

    const { ...recipe } = await RecipesServices.create({
        name, ingredients, preparation, userId: _id.toString(),
    });

    response.status(201).json({
        recipe: {
            name: recipe.name,
            ingredients: recipe.ingredients,
            preparation: recipe.preparation,
            userId: recipe.userId,
            _id,
        },
    });
});

module.exports = {
    findAll,
    create,
};
