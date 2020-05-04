import Joi from 'joi';
import { commentService, getCommentsService, getLoginService } from '../services/genericService';

const commentIdParser = Joi.object({
  orderid: Joi.number()
    .integer()
    .min(0),

  modelid: Joi.number()
    .integer()
    .min(0),

  productid: Joi.number()
    .integer()
    .min(0),

}).xor('orderid', 'modelid', 'productid');

const commentParser = Joi.object({
  commenttype: Joi.string()
    .valid(['Order', 'Model', 'Product'])
    .required(),

  orderid: Joi.number()
    .integer()
    .min(0),

  modelid: Joi.number()
    .integer()
    .min(0),

  productid: Joi.number()
    .integer()
    .min(0),

  comment: Joi.string()
    .required(),

  internal: Joi.boolean()
    .required(),

}).xor('orderid', 'modelid', 'productid');

export async function comment(req, res) {
  try {
    const { error, value } = commentParser.validate(req.body);
    if (typeof error !== 'undefined' && error !== null) {
      const responseObject = {
        status: '',
        error: error.details[0].message,
        data: {},
      };
      return res.send(responseObject);
    }
    return commentService(value, req.session.userid).then((result) => {
      res.send(result);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return res.send('Failed');
  }
}

export async function getComments(req, res) {
  try {
    const { error, value } = commentIdParser.validate(req.body);
    if (typeof error !== 'undefined' && error !== null) {
      const responseObject = {
        status: '',
        error: error.details[0].message,
        data: {},
      };
      return res.send(responseObject);
    }
    return getCommentsService(value).then((result) => {
      res.send(result);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return res.send('Failed');
  }
}

export async function getLogin(req, res) {
  try {
    return getLoginService(req).then((result) => {
      res.send(result);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return res.send('Failed');
  }
}
