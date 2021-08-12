// colocar query do MongoDB
const { connection } = require('../models/connection');

const db = await connection();
await db.users.deleteMany({});
await db.users.insertOne({ name: 'admin', email: 'root@email.com', password: 'admin', role: 'admin' });

