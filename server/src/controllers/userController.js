import Joi from 'joi';
import {
  getUsersService,
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
    return loginService(value).then((result) => {
      const temp = result;
      if (result.error === '') {
        req.session.userid = result.data.userid;
        req.session.usertype = result.data.usertype;
      }
      res.send(temp);
    });
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
    return userCreationService(value).then((result) => {
      res.send(result);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return res.send('Failed');
  }
}

export async function logout(req, res) {
  try {
    return logoutService(req.session).then((result) => {
      res.send(result);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return res.send('Failed');
  }
}

export async function getusers(req, res) {
  try {
    return getUsersService().then((result) => {
      res.send(result);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return res.send('Failed');
  }
}

export async function edituser(req, res) {
  try {
    const { error, value } = editUserParser.validate(req.body);
    if (typeof error !== 'undefined' && error !== null) {
      const responseObject = {
        status: '',
        error: error.details[0].message,
        data: {},
      };
      return res.send(responseObject);
    }
    return editUserService(value).then((result) => {
      res.send(result);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return res.send('Failed');
  }
}

export async function deleteuser(req, res) {
  try {
    const { error, value } = editUserParser.validate(req.body);
    if (typeof error !== 'undefined' && error !== null) {
      const responseObject = {
        status: '',
        error: error.details[0].message,
        data: {},
      };
      return res.send(responseObject);
    }
    return deleteUserService(value).then((result) => {
      res.send(result);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return res.send('Failed');
  }
}
