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
        .where('modelid', data.modelid);

      const productStates = [];
      for (const product of products) {
        productStates.push({
          productid: product.productid,
          userid,
          statebefore: 'ProductReceived',
          stateafter: 'ProductDev',
        });
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
            statebefore: 'OrderReview',
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

export async function getModels(orderid) {
  return knexPool('models')
    .select(['modelid', 'modelowner', 'name'])
    .where('orderid', orderid);
}

export async function getModel(modelid) {
  return knexPool('models')
    .select(['modelid', 'modelowner', 'name'])
    .where('modelid', modelid);
}

export async function getAllModels() {
  return knexPool('models')
    .select(['modelid', 'modelowner', 'name']);
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

export async function getModellerModels(id) {
  return knexPool('models')
    .where('modelowner', id);
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
    .where('products.modelid', id);
}

export async function setProductDoneModeller(productid, userid) {
  let newState;
  try {
    await knexPool.transaction(async (trx) => {
      const [productstate] = await trx('productstates')
        .join((querybuilder) => {
          querybuilder.from('productstates')
            .where('productid', productid)
            .max('time')
            .groupBy('productid')
            .as('t1');
        }, 'productstates.time', 't1.max');

      const allowedStates = ['ProductDev', 'ProductRefine', 'ClientFeedback'];
      if (typeof productstate === 'undefined' || !allowedStates.includes(productstate.stateafter)) {
        throw new Error('Product does not exist or does not have allowed previous state');
      }

      [newState] = await trx('productstates')
        .insert({
          productid,
          userid,
          statebefore: productstate.stateafter,
          stateafter: 'ProductReview',
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

export async function approveProductQA(productid, userid) {
  let newState;
  try {
    await knexPool.transaction(async (trx) => {
      const [productstate] = await trx('productstates')
        .join((querybuilder) => {
          querybuilder.from('productstates')
            .where('productid', productid)
            .max('time')
            .groupBy('productid')
            .as('t1');
        }, 'productstates.time', 't1.max');

      const allowedStates = ['ProductReview'];
      if (typeof productstate === 'undefined' || !allowedStates.includes(productstate.stateafter)) {
        throw new Error('Product does not exist or does not have allowed previous state');
      }

      [newState] = await trx('productstates')
        .insert({
          productid,
          userid,
          statebefore: productstate.stateafter,
          stateafter: 'ClientProductReceived',
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

export async function approveProductClient(productid, userid) {
  let newState;
  try {
    await knexPool.transaction(async (trx) => {
      const [productstate] = await trx('productstates')
        .join((querybuilder) => {
          querybuilder.from('productstates')
            .where('productid', productid)
            .max('time')
            .groupBy('productid')
            .as('t1');
        }, 'productstates.time', 't1.max');

      const allowedStates = ['ClientProductReceived'];
      if (typeof productstate === 'undefined' || !allowedStates.includes(productstate.stateafter)) {
        throw new Error('Product does not exist or does not have allowed previous state');
      }

      [newState] = await trx('productstates')
        .insert({
          productid,
          userid,
          statebefore: productstate.stateafter,
          stateafter: 'ProductDone',
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

export async function rejectProductQA(productid, userid) {
  let newState;
  try {
    await knexPool.transaction(async (trx) => {
      const [productstate] = await trx('productstates')
        .join((querybuilder) => {
          querybuilder.from('productstates')
            .where('productid', productid)
            .max('time')
            .groupBy('productid')
            .as('t1');
        }, 'productstates.time', 't1.max');

      const allowedStates = ['ProductReview'];
      if (typeof productstate === 'undefined' || !allowedStates.includes(productstate.stateafter)) {
        throw new Error('Product does not exist or does not have allowed previous state');
      }

      [newState] = await trx('productstates')
        .insert({
          productid,
          userid,
          statebefore: productstate.stateafter,
          stateafter: 'ProductRefine',
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

export async function rejectProductClient(productid, userid) {
  let newState;
  try {
    await knexPool.transaction(async (trx) => {
      const [productstate] = await trx('productstates')
        .join((querybuilder) => {
          querybuilder.from('productstates')
            .where('productid', productid)
            .max('time')
            .groupBy('productid')
            .as('t1');
        }, 'productstates.time', 't1.max');

      const allowedStates = ['ClientProductReceived'];
      if (typeof productstate === 'undefined' || !allowedStates.includes(productstate.stateafter)) {
        throw new Error('Product does not exist or does not have allowed previous state');
      }

      [newState] = await trx('productstates')
        .insert({
          productid,
          userid,
          statebefore: productstate.stateafter,
          stateafter: 'ClientFeedback',
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

export async function setProductMissing(productid, userid) {
  let newState;
  try {
    await knexPool.transaction(async (trx) => {
      const [productstate] = await trx('productstates')
        .join((querybuilder) => {
          querybuilder.from('productstates')
            .where('productid', productid)
            .max('time')
            .groupBy('productid')
            .as('t1');
        }, 'productstates.time', 't1.max');

      const disallowedStates = ['ProductDone'];
      if (typeof productstate === 'undefined' || disallowedStates.includes(productstate.stateafter)) {
        throw new Error('Product does not exist or does not have allowed previous state');
      }

      [newState] = await trx('productstates')
        .insert({
          productid,
          userid,
          statebefore: productstate.stateafter,
          stateafter: 'ProductMissing',
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

export async function resolveProductMissing(productid, userid) {
  let newState;
  try {
    await knexPool.transaction(async (trx) => {
      const [productstate] = await trx('productstates')
        .join((querybuilder) => {
          querybuilder.from('productstates')
            .where('productid', productid)
            .max('time')
            .groupBy('productid')
            .as('t1');
        }, 'productstates.time', 't1.max');

      const allowedStates = ['ProductMissing'];
      if (typeof productstate === 'undefined' || !allowedStates.includes(productstate.stateafter)) {
        throw new Error('Product does not exist or does not have allowed previous state');
      }

      [newState] = await trx('productstates')
        .insert({
          productid,
          userid,
          statebefore: productstate.stateafter,
          stateafter: 'ProductDev',
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
