import Joi from 'joi';
import { commentService, tempService } from '../services/genericService';

const commentParser = Joi.object({
  commenttype: Joi.string()
    .valid(['Order', 'Model', 'Product'])
    .required(),

  referenceid: Joi.number()
    .integer()
    .min(0)
    .required(),

  comment: Joi.string()
    .required(),
});

export async function comment(req, res) {
  try {
    const { error, value } = commentParser.validate(req.body);
    if (typeof error !== 'undefined' && error !== null) {
      res.send(error);
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

export async function temp(req, res) {
  try {
    return tempService().then((result) => {
      res.send(result);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return res.send('Failed');
  }
}
