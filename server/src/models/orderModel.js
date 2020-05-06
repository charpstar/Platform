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

export async function createOrder(orderData) {
  const modelNames = Object.keys(orderData.models);
  try {
    let createdOrderID = 0;
    await knexPool.transaction(async (trx) => {
      const [orderId] = await trx('orders')
        .insert({
          clientid: orderData.clientid,
        })
        .returning('orderid');
      createdOrderID = orderId;
      modelNames.forEach((x, i) => {
        modelNames[i] = {
          orderid: orderId,
          name: x,
        };
      });
      const models = await trx('models')
        .insert(modelNames)
        .returning(['modelid', 'name']);
      const products = [];
      models.forEach((x) => {
        orderData.models[x.name].products.forEach((y) => {
          products.push({
            modelid: x.modelid,
            color: y.color,
            link: y.link,
          });
        });
      });
      const insertedProducts = await trx('products')
        .insert(products)
        .returning(['productid']);
      const modelstates = [];
      for (const model of models) {
        modelstates.push({
          modelid: model.modelid,
          userid: orderData.clientid,
          statebefore: 'ModelInit',
          stateafter: 'ModelReceived',
        });
      }
      const productstates = [];
      for (const product of insertedProducts) {
        productstates.push({
          productid: product.productid,
          userid: orderData.clientid,
          statebefore: 'ProductInit',
          stateafter: 'ProductReceived',
        });
      }
      await trx('orderstates')
        .insert({
          orderid: orderId,
          userid: orderData.clientid,
          statebefore: 'OrderInit',
          stateafter: 'OrderReceived',
        });
      await trx('modelstates')
        .insert(modelstates);
      await trx('productstates')
        .insert(productstates);
    });
    return knexPool('orders')
      .where('orderid', createdOrderID);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return { error: 'Order failed' };
  }
}

export async function getOrders() {
  return knexPool
    .select([
      'orders.orderid',
      'orders.clientid',
      'orders.qaowner',
      'orders.time',
      'users.name as clientname',
      'users2.name as qaownername',
    ])
    .count('orders.orderid as models')
    .from('orders')
    .innerJoin('users', 'orders.clientid', 'users.userid')
    .leftJoin('users as users2', 'orders.qaowner', 'users2.userid')
    .innerJoin('models', 'orders.orderid', 'models.orderid')
    .groupBy(['orders.orderid', 'users.name', 'users2.name', 'orders.qaowner', 'orders.clientid']);
}

export async function getOrder(id) {
  return knexPool
    .select([
      'orders.orderid',
      'orders.clientid',
      'orders.qaowner',
      'orders.time',
      'users.name as clientname',
      'users2.name as qaownername',
    ])
    .count('orders.orderid as models')
    .from('orders')
    .innerJoin('users', 'orders.clientid', 'users.userid')
    .leftJoin('users as users2', 'orders.qaowner', 'users2.userid')
    .innerJoin('models', 'orders.orderid', 'models.orderid')
    .groupBy(['orders.orderid', 'users.name', 'users2.name', 'orders.qaowner', 'orders.clientid'])
    .where('orders.orderid', id);
}

export async function claimOrder(orderId, userId) {
  try {
    let temp;
    await knexPool.transaction(async (trx) => {
      const [orderExists] = await trx('orders')
        .where('orderid', orderId.id)
        .update({
          qaowner: userId,
        })
        .returning('orderid');

      if (typeof orderExists === 'undefined' || orderExists === null) {
        throw new Error('No such order');
      }

      const [tempRes] = await trx('orderstates')
        .select('stateafter')
        .join((querybuilder) => {
          querybuilder.from('orderstates')
            .where('orderid', orderId.id)
            .max('time')
            .groupBy('orderid')
            .as('t1');
        }, 'orderstates.time', 't1.max')
        .where('orderid', orderId.id);

      if (
        typeof tempRes !== 'undefined'
        && typeof tempRes.stateafter !== 'undefined'
        && tempRes.stateafter === 'OrderReceived'
      ) {
        await trx('orderstates')
          .insert({
            orderid: orderId.id,
            userid: userId,
            statebefore: 'OrderReceived',
            stateafter: 'OrderReview',
          });
      }

      temp = await trx('users')
        .where('userid', userId)
        .select('userid', 'name');
    });

    return { status: 't', data: temp };
  } catch (e) {
    // eslint-disable-next-line
    console.log(e);
    return { status: 'f' };
  }
}

export async function getClientOrders(id) {
  return knexPool('orders')
    .where('clientid', id);
}

export async function getExcel(orderid) {
  return knexPool('models')
    .select(
      'models.name',
      'products.link',
      'products.color',
      { androidlink: 't1.androidlink' },
      { ioslink: 't2.ioslink' },
    )
    .where('orderid', orderid)
    .join('products', 'models.modelid', 'products.modelid')
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
      querybuilder.from('appleversions')
        .join((querybuilder2) => {
          querybuilder2.from('appleversions')
            .groupBy('productid')
            .max('time')
            .as('t22');
        }, 'appleversions.time', 't22.max')
        .as('t2');
    }, 'products.productid', 't2.productid');
}

export async function setOrderMissing(orderid, userid) {
  try {
    await knexPool.transaction(async (trx) => {
      const [orderExists] = await trx('orders')
        .where('orderid', orderid);

      if (typeof orderExists === 'undefined' || orderExists === null) {
        throw new Error('No such order');
      }

      const [tempRes] = await trx('orderstates')
        .select('stateafter')
        .join((querybuilder) => {
          querybuilder.from('orderstates')
            .where('orderid', orderid)
            .max('time')
            .groupBy('orderid')
            .as('t1');
        }, 'orderstates.time', 't1.max')
        .where('orderid', orderid);

      if (
        typeof tempRes !== 'undefined'
        && typeof tempRes.stateafter !== 'undefined'
        && (
          tempRes.stateafter === 'OrderReview'
          || tempRes.stateafter === 'OrderDev'
        )
      ) {
        await trx('orderstates')
          .insert({
            orderid,
            userid,
            statebefore: tempRes.stateafter,
            stateafter: 'OrderMissing',
          });
      }
    });

    return { orderid, orderstatus: 'OrderMissing' };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return { status: 'f' };
  }
}

export async function resolveOrderMissing(orderid, userid) {
  try {
    let temp;
    await knexPool.transaction(async (trx) => {
      const [orderExists] = await trx('orders')
        .where('orderid', orderid);

      if (typeof orderExists === 'undefined' || orderExists === null) {
        throw new Error('No such order');
      }

      const [tempRes] = await trx('orderstates')
        .select('stateafter')
        .join((querybuilder) => {
          querybuilder.from('orderstates')
            .where('orderid', orderid)
            .max('time')
            .groupBy('orderid')
            .as('t1');
        }, 'orderstates.time', 't1.max')
        .where('orderid', orderid);

      if (typeof tempRes === 'undefined' || tempRes === null || tempRes.stateafter !== 'OrderMissing') {
        throw new Error('Nothing to resolve');
      }

      if (
        typeof tempRes !== 'undefined'
        && typeof tempRes.stateafter !== 'undefined'
        && tempRes.stateafter === 'OrderMissing'
      ) {
        const [inDev] = await trx('models')
          .select('stateafter')
          .where('orderid', orderid)
          .join('products', 'models.modelid', 'products.modelid')
          .join((querybuilder) => {
            querybuilder.from('productstates')
              .join((querybuilder2) => {
                querybuilder2.from('productstates')
                  .where('stateafter', 'ProductDev')
                  .max('time')
                  .groupBy('productid')
                  .as('t11');
              }, 'productstates.time', 't11.max')
              .as('t1');
          }, 'products.productid', 't1.productid');

        if (
          typeof inDev !== 'undefined'
          && typeof inDev.stateafter !== 'undefined'
          && inDev.stateafter === 'ProductDev'
        ) {
          [temp] = await trx('orderstates')
            .insert({
              orderid,
              userid,
              statebefore: 'OrderMissing',
              stateafter: 'OrderDev',
            })
            .returning('stateafter');
        } else {
          [temp] = await trx('orderstates')
            .insert({
              orderid,
              userid,
              statebefore: 'OrderMissing',
              stateafter: 'OrderReview',
            })
            .returning('stateafter');
        }
      }
    });

    return { orderid, orderstatus: temp };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return { status: 'f' };
  }
}
