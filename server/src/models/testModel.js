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

export async function getNames() {
  return knexPool.select('name').from('test');
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
