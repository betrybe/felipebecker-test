const chai = require('chai');
const http = require('chai-http'); // Extensão da lib chai p/ simular requisições http
chai.use(http);
const server = require('../api/app');
const { MongoClient, ObjectId } = require('mongodb');

const mongoDbUrl = 'mongodb://localhost:27017/Cookmaster';
const url = 'http://localhost:3000';

describe('Testes na rota Recipes', () => {
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

  describe('Realizar um GET na rota recipes com sucesso', () => {
    before(async () => {
      response = await chai.request(server)
        .get('/recipes')
        .send();
    })

    it('Retorno dos resultados no GET realizado na rota recipes', () => {
      chai.expect(response).to.have.status(200);
      chai.expect(response.body).to.be.a('array');
      chai.expect(response.body[0]._id).to.be.an('string');
      chai.expect(response.body[0].name).to.be.an('string');
      chai.expect(response.body[0].ingredients).to.be.an('string');
      chai.expect(response.body[0].preparation).to.be.an('string');
    });
  });

  describe('Realizar um DELETE na rota recipes sem sucesso', () => {
    before(async () => {
      const token = await chai.request(server)
        .post('/login')
        .send({
          email: 'erickjacquin@gmail.com',
          password: '12345678',
        })
        .then(({ body }) => body.token);

      recipes = await chai.request(server)
        .get('/recipes')
        .send();

      response = await chai.request(server)
        .delete(`/recipes/${recipes.body[0]._id}`)
        .set('Authorization', token)
        .send();
    })

    it('Retorno dos resultados no GET realizado na rota recipes', () => {
      chai.expect(response).to.have.status(400);
      chai.expect(response.body).to.have.property('message');
      chai.expect(response.body.message).to.equal('Invalid data. Permission denied to remove');
    });
  });

  describe('Realizar um PUT na rota recipes sem sucesso', () => {
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

      recipes = await chai.request(server)
        .get('/recipes')
        .send();

      response = await chai.request(server)
        .put(`/recipes/${recipes.body[0]._id}`, recipe)
        .set('Authorization', token)
        .send();
    })

    it('Retorno dos resultados no GET realizado na rota recipes', () => {
      chai.expect(response).to.have.status(400);
      chai.expect(response.body).to.have.property('message');
      chai.expect(response.body.message).to.equal('Invalid entries. Try again.');
    });
  });

  describe('Realizar um POST na rota recipes com sucesso', () => {

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

    it('Retorno dos resultados no POST realizado na rota recipes', () => {
      chai.expect(response).to.have.status(201);
      chai.expect(response.body.recipe.name).to.equal(recipe.name);
      chai.expect(response.body.recipe.ingredients).to.equal(recipe.ingredients);
      chai.expect(response.body.recipe.preparation).to.equal(recipe.preparation);
    });
  });

  describe('Caso o token não seja passado', () => {
    let response = {};

    before(async () => {
      response = await chai.request(server)
        .get(`/recipes/${ObjectId()}`)
        .send();
    })

    it('retorna erro 404', () => {
      chai.expect(response).to.have.status(404);
    })

    it('retornar a mensagem de token não encontrado', () => {
      chai.expect(response.body).to.have.property('message');
      chai.expect(response.body.message).to.equal('recipe not found');
    })
  })
});