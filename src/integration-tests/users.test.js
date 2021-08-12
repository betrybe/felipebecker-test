const chai = require('chai');
const http = require('chai-http'); // Extensão da lib chai p/ simular requisições http
chai.use(http);
const server = require('../api/app');
const { MongoClient } = require('mongodb');

const mongoDbUrl = 'mongodb://localhost:27017/Cookmaster';

describe('Routes: Users', () => {
  let connection;
  let db;

  const defaultUser = {
    name: 'Erick Jaquin',
    email: 'erickjaquin@gmail.com',
    password: '12345678',
  };

  before(async () => {
    connection = await MongoClient.connect(mongoDbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = connection.db('Cookmaster');
    await db.collection('users').deleteMany({});
    await db.collection('recipes').deleteMany({});
    const users = {
      name: 'admin', email: 'root@email.com', password: 'admin', role: 'admin'
    };
    await db.collection('users').insertOne(users);
  });

  after(async () => {
    await connection.close();
  });

  describe('GET /users', () => {
    before(async () => {
      response = await chai.request(server)
        .get('/users')
        .send();
    })

    it('/users - GET', () => {
      chai.expect(response).to.have.status(200);
      chai.expect(response.body).to.be.a('array');
      chai.expect(response.body[0]._id).to.be.an('string');
      chai.expect(response.body[0].name).to.be.an('string');
      chai.expect(response.body[0].email).to.be.an('string');
      chai.expect(response.body[0].password).to.be.an('string');
      chai.expect(response.body[0].role).to.be.an('string');
    });
  });

  describe('POST /users', () => {
    it('should post a user', () => {
      before(async () => {
        response = await chai.request(server)
          .post('/users')
          .send(defaultUser);
      })
      it('/users - POST', () => {
        chai.expect(response).to.have.status(200);
        chai.expect(response.body.user.name).to.equal(defaultUser.name);
        chai.expect(response.body.user.email).to.equal(defaultUser.email);
        chai.expect(response.body.user.password).to.equal(defaultUser.password);
        chai.expect(response.body).to.have.property('message');
        chai.expect(response.body).to.be.a('object');
        chai.expect(response.body.message).to.equal('Email already registered');
        
      });
    });
  });
});