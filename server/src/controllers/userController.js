import Joi from 'joi';
import { validateAndRunService, runServiceWithData } from './controllerFunctions';
import {
  getUsersService,
  getUserService,
  loginService,
  userCreationService,
  logoutService,
  editUserService,
  deleteUserService,
} from '../services/userService';

const loginParser = Joi.object({
  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
});

const userParser = Joi.object({
  name: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),

  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .required(),

  repeatPassword: Joi.ref('password'),

  email: Joi.string()
    .email()
    .required(),

  usertype: Joi.string()
    .valid(['Client', 'QA', 'Modeller', 'Admin'])
    .required(),

  active: Joi.boolean()
    .required(),
})
  .with('password', 'repeatPassword');

const editUserParser = Joi.object({
  userid: Joi.number()
    .min(0)
    .required(),

  name: Joi.string()
    .alphanum()
    .min(3)
    .max(30),

  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{3,30}$/),

  repeatPassword: Joi.ref('password'),

  email: Joi.string()
    .email(),

  usertype: Joi.string()
    .valid(['Client', 'QA', 'Modeller', 'Admin']),

  active: Joi.boolean(),
})
  .with('password', 'repeatPassword');

const useridParser = Joi.object({
  userid: Joi.number()
    .min(0)
    .required(),
});

export async function login(req, res) {
  try {
    const { error, value } = loginParser.validate(req.body);
    if (typeof error !== 'undefined' && error !== null) {
      const responseObject = {
        status: '',
        error: error.details[0].message,
        data: {},
      };
      return res.send(responseObject);
    }
    const result = await loginService(value);
    if (result.error !== '') {
      return res.send(result);
    }
    req.session.userid = result.data.userid;
    req.session.usertype = result.data.usertype;
    const user = await getUserService({ userid: result.data.userid });
    result.data = user.data;
    return res.send(result);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return res.send('Failed');
  }
}

export async function createuser(req, res) {
  try {
    const { error, value } = userParser.validate(req.body);
    if (typeof error !== 'undefined' && error !== null) {
      const responseObject = {
        status: '',
        error: error.details[0].message,
        data: {},
      };
      return res.send(responseObject);
    }
    const result = await userCreationService(value);
    if (result.error !== '') {
      return res.send(result);
    }
    const user = await getUserService({ userid: result.data.userid });
    result.data = user.data;
    return res.send(result);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return res.send('Failed');
  }
}

export async function logout(req, res) {
  return runServiceWithData(logoutService, req.session, req, res);
}

export async function getusers(req, res) {
  return runServiceWithData(getUsersService, {}, req, res);
}

export async function getuser(req, res) {
  return validateAndRunService(useridParser, getUserService, req, res);
}

export async function getmodelers(req, res) {
  return runServiceWithData(getUsersService, { usertype: 'Modeller' }, req, res);
}

export async function edituser(req, res) {
  return validateAndRunService(editUserParser, editUserService, req, res);
}

export async function deleteuser(req, res) {
  return validateAndRunService(editUserParser, deleteUserService, req, res);
}
