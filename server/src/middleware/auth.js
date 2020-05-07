export async function genericAuth(req, res, next) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  if (typeof req.session.userid === 'undefined') {
    responseObject.error = 'Not signed in';
    return res.send(responseObject);
  }

  next();
}

export async function adminAuth(req, res, next) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  if (typeof req.session.userid === 'undefined') {
    responseObject.error = 'Not signed in';
    return res.send(responseObject);
  }

  if (req.session.usertype !== 'Admin') {
    responseObject.error = 'Insufficient permissions';
    return res.send(responseObject);
  }

  next();
}

export async function modellerAuth(req, res, next) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  if (typeof req.session.userid === 'undefined') {
    responseObject.error = 'Not signed in';
    return res.send(responseObject);
  }

  if (!['Modeller', 'Admin', 'QA'].includes(req.session.usertype)) {
    responseObject.error = 'Insufficient permissions';
    return res.send(responseObject);
  }

  next();
}


export async function qaAuth(req, res, next) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  if (typeof req.session.userid === 'undefined') {
    responseObject.error = 'Not signed in';
    return res.send(responseObject);
  }

  if (!['QA', 'Admin'].includes(req.session.usertype)) {
    responseObject.error = 'Insufficient permissions';
    return res.send(responseObject);
  }

  next();
}

export async function clientAuth(req, res, next) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  if (typeof req.session.userid === 'undefined') {
    responseObject.error = 'Not signed in';
    return res.send(responseObject);
  }

  if (req.session.usertype !== 'Client') {
    responseObject.error = 'Insufficient permissions';
    return res.send(responseObject);
  }

  next();
}
