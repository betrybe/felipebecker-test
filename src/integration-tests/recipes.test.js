const chai = require('chai');
const http = require('chai-http'); // Extensão da lib chai p/ simular requisições http
chai.use(http);
const server = require('../api/app');
const { MongoClient } = require('mongodb');

const mongoDbUrl = 'mongodb://localhost:27017/Cookmaster';
const url = 'http://localhost:3000';

describe('Routes: Recipes', () => {
  let connection;
  let db;

  before(async () => {
    connection = await MongoClient.connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db('Cookmaster');
    await db.collection('users').deleteMany({});
    await db.collection('recipes').deleteMany({});
    const users = [
      { name: 'admin', email: 'root@email.com', password: 'admin', role: 'admin' },
      {
        name: 'Erick Jacquin',
        email: 'erickjacquin@gmail.com',
        password: '12345678',
        role: 'user',
      },
    ];
    await db.collection('users').insertMany(users);

    const recipes = [
      { name: 'bolo de caneca', ingredients: 'mistura pronta', preparation: 'aquecer no micro' },
      { name: 'banana com canela', ingredients: 'banana e canela', preparation: 'misturar ambos' },
    ];
    await db.collection('recipes').insertMany(recipes);
  });

  after(async () => {
    await connection.close();
  });

  describe('GET /recipes', () => {
    before(async () => {
      response = await chai.request(server)
        .get('/recipes')
        .send();
    })

    it('/recipes - GET', () => {
      chai.expect(response).to.have.status(200);
      chai.expect(response.body).to.be.a('array');
      chai.expect(response.body[0]._id).to.be.an('string');
      chai.expect(response.body[0].name).to.be.an('string');
      chai.expect(response.body[0].ingredients).to.be.an('string');
      chai.expect(response.body[0].preparation).to.be.an('string');
    });
  });

  describe('POST /recipes', () => {

    const recipe = {
      name: 'teste123',
      ingredients: 'Frango',
      preparation: '10 min no forno',
    };

    before(async () => {
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'erickjacquin@gmail.com',
          password: '12345678',
        })
        .then(({ body }) => body.token);

      response = await chai.request(server)
        .post('/recipes')
        .set('Authorization', token)
        .send(recipe);
    });

    it('/recipes - POST', () => {
      chai.expect(response).to.have.status(201);
      chai.expect(response.body.recipe.name).to.equal(recipe.name);
      chai.expect(response.body.recipe.ingredients).to.equal(recipe.ingredients);
      chai.expect(response.body.recipe.preparation).to.equal(recipe.preparation);
    });
  });
});