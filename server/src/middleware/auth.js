import { getUser } from '../models/userModel';

export async function adminAuth(req, res, next) {
  if (typeof req.session.userid === 'undefined') {
    return res.send({ error: 'Not signed in' });
  }

  const userData = await getUser(req.session.userid);

  if (userData[0].usertype !== 'Admin') {
    return res.send({ error: 'Insufficient permissions' });
  }

  next();
}

export async function clientAuth(req, res, next) {
  if (typeof req.session.userid === 'undefined') {
    return res.send({ error: 'Not signed in' });
  }

  const userData = await getUser(req.session.userid);

  if (userData[0].usertype !== 'Client') {
    return res.send({ error: 'Insufficient permissions' });
  }

  next();
}
