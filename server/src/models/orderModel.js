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
    await knexPool.transaction(async (trx) => {
      const [orderId] = await trx('orders')
        .insert({
          clientid: orderData.clientid,
        })
        .returning('orderid');
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
    return { status: 'Order Made' };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return { status: 'Order failed' };
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

export async function claimOrder(orderId, userId) {
  try {
    await knexPool.transaction(async (trx) => {
      await trx('orders')
        .where('orderid', orderId.id)
        .update({
          qaowner: userId,
        });
      await trx('orderstates')
        .insert({
          orderid: orderId.id,
          userid: userId,
          statebefore: 'OrderReceived',
          stateafter: 'OrderReview',
        });
    });
    return { status: 'Claim successful' };
  } catch (e) {
    // eslint-disable-next-line
    console.log(e);
    return { status: 'Claim failed' };
  }
}
