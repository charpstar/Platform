import { getUser } from '../models/userModel';

export async function genericAuth(req, res, next) {
  if (typeof req.session.userid === 'undefined') {
    return res.send({ error: 'Not signed in' });
  }

  next();
}

export async function adminAuth(req, res, next) {
  if (typeof req.session.userid === 'undefined') {
    return res.send({ error: 'Not signed in' });
  }

  if (req.session.usertype !== 'Admin') {
    return res.send({ error: 'Insufficient permissions' });
  }

  next();
}

export async function modellerAuth(req, res, next) {
  if (typeof req.session.userid === 'undefined') {
    return res.send({ error: 'Not signed in' });
  }

  if (!['Modeller', 'Admin', 'QA'].includes(req.session.usertype)) {
    return res.send({ error: 'Insufficient permissions'});
  }

  next();
}


export async function qaAuth(req, res, next) {
  if (typeof req.session.userid === 'undefined') {
    return res.send({ error: 'Not signed in' });
  }

  if (!['QA', 'Admin'].includes(req.session.usertype)) {
    return res.send({ error: 'Insufficient permissions'});
  }

  next();
}

export async function clientAuth(req, res, next) {
  if (typeof req.session.userid === 'undefined') {
    return res.send({ error: 'Not signed in' });
  }

  if (req.session.usertype !== 'Client') {
    return res.send({ error: 'Insufficient permissions' });
  }

  next();
}
