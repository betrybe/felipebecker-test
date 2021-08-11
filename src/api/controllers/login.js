const LoginServices = require('../services/login');

const login = async (request, response) => {
        const token = await LoginServices.auth(request.body);

        return response.status(200).json({ token });
};

module.exports = {
    login,
};
