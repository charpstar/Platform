import Joi from 'joi';
import { orderCreationService, getOrdersService, claimOrderService } from '../services/orderService';

const idParser = Joi.object({
  id: Joi.number()
    .integer()
    .min(0)
    .required(),
});

export async function createorder(req, res) {
  try {
    return orderCreationService(req).then((result) => {
      res.send(result);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return res.send('Failed');
  }
}

export async function getorders(req, res) {
  try {
    return getOrdersService().then((result) => {
      res.send(result);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return res.send('Failed');
  }
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
    return claimOrderService(value, req.session.userid).then((result) => {
      res.send(result);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return res.send('Failed');
  }
}
