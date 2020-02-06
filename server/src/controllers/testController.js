import joi from 'joi';
import { getNameService, getIdService } from '../services/testService';

const checkId = joi.object({
  id: joi.number()
    .required(),
});

export async function listNames(req, res) {
  try {
    return getNameService().then((result) => res.send(result));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return res.send('Failed');
  }
}

export async function getId(req, res) {
  try {
    const { error, value } = joi.validate(req.body, checkId);
    if (typeof error !== 'undefined' && error !== null) {
      return error;
    }
    return getIdService(value).then((result) => {
      res.send(result);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return res.send('Failed');
  }
}
