import dotenv from 'dotenv';
import knex from 'knex';

const envFetch = dotenv.config();

if (envFetch.error) {
  throw envFetch.error;
}

const knexPool = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
  },
  pool: { min: 0, max: 10 },
});

export async function checkEmail(email) {
  return knexPool('users').where('email', email);
}

export async function createUser(userdata) {
  return knexPool('users').insert({
    usertype: userdata.usertype,
    name: userdata.name,
    email: userdata.email,
    hash: userdata.hash,
    active: userdata.active,
  });
}

export async function getUser(id) {
  return knexPool('users').where('userid', id);
}

export async function getNameUsingId(id) {
  try {
    return knexPool
      .from('test')
      .where(id)
      .select('name');
  } catch (e) {
    return e;
  }
}
