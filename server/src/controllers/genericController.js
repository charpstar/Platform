import Joi from 'joi';
import { validateAndRunService, runServiceWithData } from './controllerFunctions';
import { commentService, getCommentsService } from '../services/genericService';
import { getUsersService } from '../services/userService';

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
    .allow('')
    .required(),

  internal: Joi.boolean()
    .required(),

  commentclass: Joi.string()
    .valid(['Comment', 'Reject', 'Resolve', 'Approve', 'Done', 'Info'])
    .required(),

}).xor('orderid', 'modelid', 'productid');

export async function comment(req, res) {
  return validateAndRunService(commentParser, commentService, req, res);
}

export async function getComments(req, res) {
  return validateAndRunService(commentIdParser, getCommentsService, req, res);
}

export async function getLogin(req, res) {
  return runServiceWithData(getUsersService, { userid: req.session.userid }, req, res);
}
