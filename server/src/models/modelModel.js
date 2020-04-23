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

export async function uploadModel(path, ext, id) {
  const [exists] = await knexPool('productversions')
    .where('productid', id)
    .count();

  if (exists.count === '0') {
    if (ext === '.glb') {
      return knexPool('productversions')
        .insert({
          productid: id,
          androidlink: path,
        })
        .returning(['androidlink']);
    }

    if (ext === '.usdz') {
      return knexPool('productversions')
        .insert({
          productid: id,
          ioslink: path,
        })
        .returning(['ioslink']);
    }

    return knexPool('productversions')
      .insert({
        productid: id,
        blenderlink: path,
      })
      .returning(['blenderlink']);
  }

  if (ext === '.glb') {
    return knexPool('productversions')
      .update({
        androidlink: path,
      })
      .where('productid', id)
      .returning(['androidlink']);
  }

  if (ext === '.usdz') {
    return knexPool('productversions')
      .update({
        ioslink: path,
      })
      .where('productid', id)
      .returning(['ioslink']);
  }

  return knexPool('productversions')
    .update({
      blenderlink: path,
    })
    .where('productid', id)
    .returning(['blenderlink']);
}

export async function getModellerModels(id) {
  return knexPool('models')
    .where('modelowner', id);
}

export async function getProducts(id) {
  return knexPool()
    .select('products.productid',
      'products.modelid',
      'products.color',
      'products.link',
      'products.broken',
      'productversions.time',
      'productversions.androidlink',
      'productversions.ioslink')
    .from('products')
    .leftJoin('productversions', 'products.productid', 'productversions.productid')
    .where('modelid', id);
}
