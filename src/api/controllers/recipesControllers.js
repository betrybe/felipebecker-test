const RecipesServices = require('../services/recipesService');

const findAll = (async (_request, response) => {
    const results = await RecipesServices.findAll();
    response.json(results);
});

const findById = (async (request, response) => {
    const { id } = request.params;
    const result = await RecipesServices.findById(id);

    if (!result) {
        response.status(404).json({ message: 'recipe not found' });
    } else {
        response.json(result);
    }
});

const create = (async (request, response) => {
    const { name, ingredients, preparation } = request.body;
    const { _id: user } = request.user;

    const { _id, ...recipe } = await RecipesServices.create({
        name, ingredients, preparation, userId: user.toString(),
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

const edit = (async (request, response) => {
    const { id } = request.params;
    const { _id: user, role } = request.user;

    request.body.userId = user.toString();
    const results = await RecipesServices.edit(id, request.body, role);
    response.json(results);
  });

module.exports = {
    findAll,
    findById,
    create,
    edit,
};
