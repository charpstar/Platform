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
    .select(['name', 'userid', 'email'])
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

export async function getAllModels() {
  return knexPool('models')
    .select(['modelid', 'modelowner', 'name']);
}

export async function uploadModelFile(userid, path, modelid) {
  return knexPool('modelfiles')
    .insert({
      modelid,
      userid,
      path,
    })
    .returning('*');
}

export async function uploadIos(path, id, userid) {
  await knexPool('appleversions')
    .insert({
      productid: id,
      userid,
      ioslink: path,
    });

  await knexPool('appleversions')
    .where('productid', id)
    .whereNotIn('time', (querybuilder) => {
      querybuilder.select('time')
        .from('appleversions')
        .where('productid', id)
        .orderBy('time', 'desc')
        .limit(2);
    })
    .del();

  const [tempRes] = await knexPool('appleversions')
    .where('productid', id)
    .orderBy('time', 'asc')
    .limit(1);

  const regex = /newios/g;
  const newLink = tempRes.ioslink.replace(regex, 'oldios');

  await knexPool('appleversions')
    .whereNotIn('time', (querybuilder) => {
      querybuilder.select('time')
        .from('appleversions')
        .where('productid', id)
        .orderBy('time', 'desc')
        .limit(1);
    })
    .update('ioslink', newLink);

  const res = await knexPool('appleversions')
    .where('productid', id)
    .orderBy('time', 'desc');

  return res;
}

export async function uploadAndroid(path, id, userid) {
  await knexPool('androidversions')
    .insert({
      productid: id,
      userid,
      androidlink: path,
    });

  await knexPool('androidversions')
    .where('productid', id)
    .whereNotIn('time', (querybuilder) => {
      querybuilder.select('time')
        .from('androidversions')
        .where('productid', id)
        .orderBy('time', 'desc')
        .limit(2);
    })
    .del();

  const [tempRes] = await knexPool('androidversions')
    .where('productid', id)
    .orderBy('time', 'asc')
    .limit(1);

  const regex = /newandroid/g;
  const newLink = tempRes.androidlink.replace(regex, 'oldandroid');

  await knexPool('androidversions')
    .whereNotIn('time', (querybuilder) => {
      querybuilder.select('time')
        .from('androidversions')
        .where('productid', id)
        .orderBy('time', 'desc')
        .limit(1);
    })
    .update('androidlink', newLink);

  const res = await knexPool('androidversions')
    .where('productid', id)
    .orderBy('time', 'desc');

  return res;
}

export async function getModellerModels(id) {
  return knexPool('models')
    .where('modelowner', id);
}

export async function getProducts(id) {
  return knexPool('products')
    .select('products.productid',
      'products.modelid',
      'products.color',
      'products.link',
      'products.broken',
      { androidtime: 'androidversions.time' },
      'androidversions.androidlink',
      { androiduser: 'androidversions.userid' },
      { iostime: 'appleversions.time' },
      'appleversions.ioslink',
      { iosuser: 'appleversions.userid' })
    .leftJoin('androidversions', 'products.productid', 'androidversions.productid')
    .leftJoin('appleversions', 'products.productid', 'appleversions.productid')
    .where('modelid', id);
}
