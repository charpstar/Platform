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

export async function statSaver(userAgentString, ip, url) {
  return knexPool('linkdata')
    .insert({
      endpoint: url,
      ip,
      useragentstring: userAgentString,
    });
}

export async function comment(data) {
  const [tempRes] = await knexPool('comments')
    .insert(data)
    .returning(['commentid']);

  return knexPool('comments')
    .select([
      'comments.commentid',
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

export async function editComment(data) {
  const [tempRes] = await knexPool('comments')
    .where('commentid', data.commentid)
    .where('userid', data.userid)
    .update('comment', data.newcomment)
    .update('editcomment', knexPool.fn.now())
    .returning(['commentid']);

  if (typeof tempRes === 'undefined' || tempRes === null) {
    return { error: 'Comment either doesn\'t exist or isn\'t yours' };
  }

  return knexPool('comments')
    .select([
      'comments.commentid',
      'comments.comment',
      'comments.time',
      'comments.internal',
      'comments.commentclass',
      'comments.editcomment as edittime',
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
    .select('commentid', 'time', 'comment', 'usertype', 'name', 'internal', 'editcomment as edittime', 'commentclass')
    .orderBy('time');
}
