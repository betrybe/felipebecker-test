const UsersServices = require('../services/users');

const findAll = (async (_request, response) => {
    const results = await UsersServices.findAll();
    response.json(results);
});

const create = (async (request, response) => {
    const { name, email, password, role } = request.body;
   
    const { _id, ...user } = await UsersServices.create({
        name, email, password, role,
    });

    response.status(201).json({ user: {
        name: user.name,
        email: user.email,
        role: user.role,
        _id,
    } });
});

module.exports = {
    findAll,  
    create,   
};
