import dotenv from 'dotenv';
import knex from 'knex';
import { statePriority } from '../config/config';

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

export async function assignModeler(data, userid) {
  try {
    let temp;
    await knexPool.transaction(async (trx) => {
      const [modelExists] = await trx('models')
        .where('modelid', data.modelid)
        .update('modelowner', data.modelerid)
        .returning(['modelid', 'name', 'modelowner', 'orderid']);

      if (typeof modelExists === 'undefined' || modelExists === null) {
        throw new Error('No such model');
      }

      const products = await trx('products')
        .select('productid')
        .join('productstates', 'products.productid', 'productstates.productid')
        .where('modelid', data.modelid);

      const productStates = [];
      for (const product of products) {
        if (product.stateafter === 'ProductReceived') {
          productStates.push({
            productid: product.productid,
            userid,
            statebefore: product.stateafter,
            stateafter: 'ProductDev',
          });
        }
      }

      await trx('productstates')
        .insert(productStates);

      const [tempRes] = await trx('orderstates')
        .select('stateafter')
        .join((querybuilder) => {
          querybuilder.from('orderstates')
            .where('orderid', modelExists.orderid)
            .max('time')
            .groupBy('orderid')
            .as('t1');
        }, 'orderstates.time', 't1.max')
        .where('orderid', modelExists.orderid);

      if (
        typeof tempRes !== 'undefined'
        && typeof tempRes.stateafter !== 'undefined'
        && tempRes.stateafter === 'OrderReview'
      ) {
        await trx('orderstates')
          .insert({
            orderid: modelExists.orderid,
            userid,
            statebefore: tempRes.stateafter,
            stateafter: 'OrderDev',
          });
      }

      temp = await trx('users')
        .where('userid', data.modelerid)
        .select('userid', 'name');
    });

    return { status: 't', data: temp };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return { status: 'f' };
  }
}

export async function getModels(filter) {
  const states = await knexPool
    .raw('select modelid, array_to_json(array_agg(stateafter)) as states from curstat group by modelid');

  const modelStates = {};

  for (const model of states.rows) {
    let i = 8;
    for (const state of model.states) {
      if (statePriority.indexOf(state) < i) {
        i = statePriority.indexOf(state);
      }
    }
    modelStates[model.modelid] = {
      modelid: model.modelid,
      state: statePriority[i],
    };
  }

  const models = await knexPool('models')
    .select(['modelid', 'models.name as modelname', 'users.name as modelowner'])
    .leftJoin('users', 'models.modelowner', 'users.userid')
    .where(filter);

  const ret = {};
  for (const model of models) {
    ret[model.modelid] = modelStates[model.modelid];
    ret[model.modelid].modelname = model.modelname;
    ret[model.modelid].modelowner = model.modelowner;
  }

  return ret;
}

export async function uploadModelFile(userid, filename, modelid) {
  await knexPool('modelfiles')
    .where('modelid', modelid)
    .where('filename', filename)
    .del();

  return knexPool('modelfiles')
    .insert({
      modelid,
      userid,
      filename,
    })
    .returning('*');
}

export async function deleteModelFile(data) {
  return knexPool('modelfiles')
    .where('modelid', data.modelid)
    .where('filename', data.filename)
    .del();
}

export async function deleteProduct(data) {
  await knexPool('productstates')
    .where('productid', data.productid)
    .del();

  await knexPool('comments')
    .where('productid', data.productid)
    .del();

  await knexPool('androidversions')
    .where('productid', data.productid)
    .del();

  await knexPool('appleversions')
    .where('productid', data.productid)
    .del();

  await knexPool('products')
    .where('productid', data.productid)
    .del();

  return null;
}

export async function deleteModel(data) {
  const products = await knexPool('products')
    .select(['productid'])
    .where('modelid', data.modelid);

  const productIds = [];
  for (const product of products) {
    productIds.push(product.productid);
  }

  await knexPool('productstates')
    .whereIn('productid', productIds)
    .del();

  await knexPool('comments')
    .whereIn('productid', productIds)
    .orWhere('modelid', data.modelid)
    .del();

  await knexPool('androidversions')
    .whereIn('productid', productIds)
    .del();

  await knexPool('appleversions')
    .whereIn('productid', productIds)
    .del();

  await knexPool('products')
    .whereIn('productid', productIds)
    .del();

  await knexPool('modelfiles')
    .where('modelid', data.modelid)
    .del();

  await knexPool('models')
    .where('modelid', data.modelid)
    .del();

  return productIds;
}

export async function editProductLink(data) {
  return knexPool('products')
    .where('productid', data.productid)
    .update('link', data.newlink)
    .returning(['productid', 'link']);
}

export async function editProductModelId(data) {
  return knexPool('products')
    .where('productid', data.productid)
    .update('modelid', data.newmodelid)
    .returning(['productid', 'modelid']);
}

export async function editModelName(data) {
  return knexPool('models')
    .where('modelid', data.modelid)
    .update('name', data.newname)
    .returning(['modelid', 'name']);
}

export async function listModelFiles(modelid) {
  return knexPool('modelfiles')
    .select('time', 'filename')
    .where('modelid', modelid);
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

export async function getProducts(id) {
  return knexPool('products')
    .select(
      'products.productid',
      'products.modelid',
      'products.color',
      'products.link',
      'products.broken',
      { newandroidlink: 't1.androidlink' },
      { newandroidtime: 't1.time' },
      { newandroiduser: 't1.userid' },
      { oldandroidlink: 't2.androidlink' },
      { oldandroidtime: 't2.time' },
      { oldandroiduser: 't2.userid' },
      { newioslink: 't3.ioslink' },
      { newiostime: 't3.time' },
      { newiosuser: 't3.userid' },
      { oldioslink: 't4.ioslink' },
      { oldiostime: 't4.time' },
      { oldiosuser: 't4.userid' },
      'curstat.stateafter as state',
    )
    .leftJoin((querybuilder) => {
      querybuilder.from('androidversions')
        .join((querybuilder2) => {
          querybuilder2.from('androidversions')
            .groupBy('productid')
            .max('time')
            .as('t11');
        }, 'androidversions.time', 't11.max')
        .as('t1');
    }, 'products.productid', 't1.productid')
    .leftJoin((querybuilder) => {
      querybuilder.from('androidversions')
        .join((querybuilder2) => {
          querybuilder2.from('androidversions')
            .groupBy('productid')
            .min('time')
            .as('t22');
        }, 'androidversions.time', 't22.min')
        .as('t2');
    }, 'products.productid', 't2.productid')
    .leftJoin((querybuilder) => {
      querybuilder.from('appleversions')
        .join((querybuilder2) => {
          querybuilder2.from('appleversions')
            .groupBy('productid')
            .max('time')
            .as('t33');
        }, 'appleversions.time', 't33.max')
        .as('t3');
    }, 'products.productid', 't3.productid')
    .leftJoin((querybuilder) => {
      querybuilder.from('appleversions')
        .join((querybuilder2) => {
          querybuilder2.from('appleversions')
            .groupBy('productid')
            .min('time')
            .as('t44');
        }, 'appleversions.time', 't44.min')
        .as('t4');
    }, 'products.productid', 't4.productid')
    .leftJoin('curstat', 'products.productid', 'curstat.productid')
    .where('products.modelid', id);
}

export async function changeProductState(
  productid,
  userid,
  newProductState,
  allowedStates,
  disallowedStates,
) {
  let newState;
  try {
    await knexPool.transaction(async (trx) => {
      const [productstate] = await trx('curstat')
        .where('productid', productid);
      if (typeof productstate === 'undefined') {
        throw new Error('Product does not exist');
      }
      if (allowedStates != null) {
        if (!allowedStates.includes(productstate.stateafter)) {
          throw new Error(`Disallowed state: ${productstate.stateafter}`);
        }
      }
      if (disallowedStates != null) {
        if (disallowedStates.includes(productstate.stateafter)) {
          throw new Error(`Disallowed state: ${productstate.stateafter}`);
        }
      }

      [newState] = await trx('productstates')
        .insert({
          productid,
          userid,
          statebefore: productstate.stateafter,
          stateafter: newProductState,
        })
        .returning(['productid', 'stateafter']);
    });
    return newState;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return { status: 'f' };
  }
}

export async function changeModelState(
  modelid,
  userid,
  newProductState,
  newModelState,
  allowedStates,
  disallowedStates,
) {
  try {
    await knexPool.transaction(async (trx) => {
      const productstates = await trx('curstat')
        .select(['productid', 'stateafter'])
        .where('modelid', modelid);

      for (const productstate of productstates) {
        if (allowedStates != null) {
          if (!allowedStates.includes(productstate.stateafter)) {
            throw new Error(`Disallowed state: ${productstate.stateafter}`);
          }
        }
        if (disallowedStates != null) {
          if (disallowedStates.includes(productstate.stateafter)) {
            throw new Error(`Disallowed state: ${productstate.stateafter}`);
          }
        }
      }

      const newStates = [];

      for (const productstate of productstates) {
        newStates.push({
          productid: productstate.productid,
          userid,
          statebefore: productstate.stateafter,
          stateafter: newProductState,
        });
      }

      await trx('productstates')
        .insert(newStates);
    });
    return { modelid, stateafter: newModelState };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return { status: 'f' };
  }
}

export async function setProductDoneModeller(productid, userid) {
  return changeProductState(productid, userid, 'ProductReview', ['ProductDev', 'ProductRefine', 'ClientFeedback']);
}

export async function approveProductQA(productid, userid) {
  return changeProductState(productid, userid, 'ClientProductReceived', ['ProductReview']);
}

export async function approveProductClient(productid, userid) {
  return changeProductState(productid, userid, 'Done', ['ClientProductReceived']);
}

export async function rejectProductQA(productid, userid) {
  return changeProductState(productid, userid, 'ProductRefine', ['ProductReview']);
}

export async function rejectProductClient(productid, userid) {
  return changeProductState(productid, userid, 'ClientFeedback', ['ClientProductReceived']);
}

export async function setProductMissing(productid, userid) {
  return changeProductState(productid, userid, 'ProductMissing', null, ['Done']);
}

export async function resolveProductMissing(productid, userid) {
  return changeProductState(productid, userid, 'ProductDev', ['ProductMissing']);
}

export async function approveModelQA(modelid, userid) {
  return changeModelState(modelid, userid, 'ClientProductReceived', 'ClientProductReceived', ['ProductReview']);
}

export async function setModelDoneModeller(modelid, userid) {
  return changeModelState(modelid, userid, 'ProductReview', 'ModelDev', ['ProductDev', 'ProductRefine', 'ClientFeedback']);
}

export async function approveModelClient(modelid, userid) {
  return changeModelState(modelid, userid, 'Done', 'Done', ['ClientProductReceived']);
}

export async function rejectModelQA(modelid, userid) {
  return changeModelState(modelid, userid, 'ProductRefine', 'ProductRefine', ['ProductReview']);
}

export async function rejectModelClient(modelid, userid) {
  return changeModelState(modelid, userid, 'ClientFeedback', 'ClientFeedback', ['ClientProductReceived']);
}

export async function setModelMissing(modelid, userid) {
  return changeModelState(modelid, userid, 'ProductMissing', 'ModelMissing', null, ['Done']);
}

export async function resolveModelMissing(modelid, userid) {
  return changeModelState(modelid, userid, 'ProductDev', 'ModelDev', ['ProductMissing']);
}
