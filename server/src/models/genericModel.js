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

export async function comment(data) {
  return knexPool('comments')
    .insert(data)
    .returning(['comment', 'time']);
}

export async function getComments(data) {
  return knexPool('comments')
    .where(data)
    .innerJoin('users', 'comments.userid', 'users.userid')
    .select('time', 'comment', 'usertype', 'name', 'internal')
    .orderBy('time');
}

export async function getLogin(userid) {
  return knexPool('users')
    .where('userid', userid)
    .select('userid', 'usertype', 'name', 'email');
}
