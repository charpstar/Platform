import Joi from 'joi';
import { validateAndRunService, runServiceWithData } from './controllerFunctions';
import {
  getCommentsService,
  createCommentService,
  changeStateService,
} from '../services/genericService';
import { getUserService } from '../services/userService';

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

  commentclass: Joi.string()
    .valid(['Comment', 'Reject', 'Resolve', 'Approve', 'Done', 'Info'])
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

    if (value.commentclass === 'Comment') {
      const result = await createCommentService(value, req);
      return res.send(result);
    }

    const stateResult = await changeStateService(value, req);
    if (stateResult.error !== '') {
      return res.send(stateResult);
    }
    const commentResult = await createCommentService(value, req);
    if (commentResult.error !== '') {
      return res.send(commentResult);
    }
    stateResult.data.comment = commentResult.data.comment;
    return res.send(stateResult);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return res.send('Failed');
  }
}

export async function getComments(req, res) {
  return validateAndRunService(commentIdParser, getCommentsService, req, res);
}

export async function getLogin(req, res) {
  return runServiceWithData(getUserService, { userid: req.session.userid }, req, res);
}
