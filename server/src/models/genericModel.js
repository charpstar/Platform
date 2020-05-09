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
  const [tempRes] = await knexPool('comments')
    .insert(data)
    .returning(['commentid']);

  return knexPool('comments')
    .select([
      'comments.comment',
      'comments.time',
      'comments.internal',
      'comments.commentclass',
      'users.name',
      'users.usertype',
    ])
    .where('comments.commentid', tempRes.commentid)
    .join('users', 'comments.userid', 'users.userid');
}

export async function getComments(data) {
  return knexPool('comments')
    .where(data)
    .innerJoin('users', 'comments.userid', 'users.userid')
    .select('time', 'comment', 'usertype', 'name', 'internal', 'editcomment', 'commentclass')
    .orderBy('time');
}
