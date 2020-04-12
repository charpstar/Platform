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
  }).returning(['name', 'usertype', 'active', 'email']);
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

export async function getUserAmount() {
  return knexPool.from('users').count('active');
}

export async function getUsers() {
  return knexPool.from('users').select('userid', 'name', 'email', 'usertype', 'active');
}

export async function editUser(edit) {
  try {
    const [tempRes] = await knexPool.from('users').where('userid', edit.userid);
    if (typeof tempRes === 'undefined' || tempRes === null) {
      return { error: 'No such user' };
    }

    if (typeof edit.name !== 'undefined') {
      tempRes.name = edit.name;
    }

    if (typeof edit.email !== 'undefined') {
      tempRes.email = edit.email;
    }

    if (typeof edit.hash !== 'undefined') {
      tempRes.hash = edit.hash;
    }

    if (typeof edit.usertype !== 'undefined') {
      tempRes.usertype = edit.usertype;
    }

    if (typeof edit.active !== 'undefined') {
      tempRes.active = edit.active;
    }

    const updateResult = knexPool('users')
      .where('userid', tempRes.userid)
      .update(tempRes)
      .returning(['userid', 'name', 'email', 'active', 'usertype']);

    return updateResult;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return e;
  }
}

export async function deleteUser(user) {
  try {
    return knexPool('users').where('userid', user.userid).del();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return 'something went wrong';
  }
}
