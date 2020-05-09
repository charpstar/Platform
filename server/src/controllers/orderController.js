import Joi from 'joi';
import { validateAndRunService, runServiceWithData } from './controllerFunctions';
import {
  orderCreationService,
  getOrdersService,
  getOrderService,
  claimOrderService,
  getExcelService,
} from '../services/orderService';

const idParser = Joi.object({
  id: Joi.number()
    .integer()
    .min(0)
    .required(),
});

const orderidParser = Joi.object({
  orderid: Joi.number()
    .integer()
    .min(0)
    .required(),
});

const assignParser = Joi.object({
  orderid: Joi.number()
    .integer()
    .min(0)
    .required(),

  userid: Joi.number()
    .integer()
    .min(0)
    .required(),

});

const useridParser = Joi.object({
  userid: Joi.number()
    .integer()
    .min(0)
    .required(),
});

export async function getorders(req, res) {
  runServiceWithData(getOrdersService, {}, req, res);
}

export async function getorder(req, res) {
  validateAndRunService(orderidParser, getOrderService, req, res);
}

export async function getclientorders(req, res) {
  validateAndRunService(useridParser, getOrdersService, req, res);
}

export async function claimorder(req, res) {
  try {
    const { error, value } = idParser.validate(req.body);
    if (typeof error !== 'undefined' && error !== null) {
      const responseObject = {
        status: '',
        error: error.details[0].message,
        data: {},
      };
      return res.send(responseObject);
    }
    return claimOrderService(value.id, req.session.userid).then((result) => {
      res.send(result);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return res.send('Failed');
  }
}

export async function assignorder(req, res) {
  try {
    const { error, value } = assignParser.validate(req.body);
    if (typeof error !== 'undefined' && error !== null) {
      const responseObject = {
        status: '',
        error: error.details[0].message,
        data: {},
      };
      return res.send(responseObject);
    }
    return claimOrderService(value.orderid, value.userid).then((result) => {
      res.send(result);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return res.send('Failed');
  }
}

export async function getexcel(req, res) {
  try {
    const { error, value } = idParser.validate(req.body);
    if (typeof error !== 'undefined' && error !== null) {
      const responseObject = {
        status: '',
        error: error.details[0].message,
        data: {},
      };
      return res.send(responseObject);
    }
    return getExcelService(value).then((result) => {
      res.download(result);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return res.send('Failed');
  }
}

export async function createorder(req, res) {
  try {
    const result = await orderCreationService(req);
    if (typeof result.error !== 'undefined' && result.error !== null && result.error !== '') {
      return res.send(result);
    }
    const order = await getOrderService({ 'orders.orderid': result.orderid });
    return res.send(order);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return res.send('Failed');
  }
}
