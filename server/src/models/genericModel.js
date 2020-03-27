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

export async function comment(data, userid) {
  return knexPool('comments')
    .insert({
      commenttype: data.commenttype,
      modelid: data.referenceid,
      userid,
      comment: data.comment,
    })
    .returning(['comment', 'userid', 'time'])
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error);
      return { error: 'Something went wrong' };
    });
}

export async function temp() {
  return { temp: 'temp' };
}
