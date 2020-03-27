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

export async function getModelers() {
  return knexPool('users')
    .select(['name', 'userid'])
    .where('usertype', 'Modeller');
}

export async function assignModeler(data) {
  return knexPool('models')
    .where('modelid', data.modelid)
    .update('modelowner', data.modelerid)
    .returning(['modelid', 'name', 'modelowner']);
}

export async function getModels(orderid) {
  return knexPool('models')
    .select(['modelid', 'modelowner', 'name'])
    .where('orderid', orderid);
}
