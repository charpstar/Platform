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
      await trx('products')
        .insert(products);
      await trx('orderstates')
        .insert({
          orderid: orderId,
          userid: orderData.clientid,
          statebefore: 'OrderInit',
          stateafter: 'OrderReceived',
        });
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
  console.log(orderid);
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
