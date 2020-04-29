import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import {
  getModelers,
  getModels,
  assignModeler,
  getModellerModels,
  getAllModels,
  getProducts,
  uploadIos,
  uploadAndroid,
  uploadModelFile,
} from '../models/modelModel';
import { domain, port } from '../config/config';

export async function modelUploadService(req, data) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const mkdir = promisify(fs.mkdir);
  const rename = promisify(fs.rename);

  if (typeof req.file === 'undefined') {
    responseObject.error = 'No file uploaded';
    return responseObject;
  }

  try {
    const dest = path.resolve(`./private/${data.modelid}/`);
    await mkdir(dest, { recursive: true });
    await rename(req.file.path, `${dest}/${req.file.originalname}`);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    responseObject.error = 'Something went wrong';
    return responseObject;
  }

  [responseObject.data] = await uploadModelFile(
    req.session.userid,
    req.file.originalname,
    data.modelid,
  );

  responseObject.status = 'File uploaded';

  return responseObject;
}

export async function modelFileDownloadService(data) {
  return `./private/${data.modelid}/${data.filename}`;
}

export async function listModelFilesService(data) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const readdir = promisify(fs.readdir);

  try {
    const files = await readdir(`./private/${data.modelid}/`);
    responseObject.data.files = files;
  } catch (e) {
    // eslint-disable-next-line
    console.log(e);
    responseObject.error = 'Something went wrong';
    return responseObject;
  }

  responseObject.status = 'Files fetched';

  return responseObject;
}

export async function iosUploadService(req, data) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const mkdir = promisify(fs.mkdir);
  const rename = promisify(fs.rename);
  const readdir = promisify(fs.readdir);
  const unlink = promisify(fs.unlink);

  if (typeof req.file === 'undefined') {
    responseObject.error = 'No file uploaded';
    return responseObject;
  }

  const destNew = path.resolve(`./public/${data.productid}/newios/`);
  const destOld = path.resolve(`./public/${data.productid}/oldios/`);

  try {
    await mkdir(destNew, { recursive: true });
    await mkdir(destOld, { recursive: true });

    const clearFiles = await readdir(destOld);

    for (const file of clearFiles) {
      await unlink(`${destOld}/${file}`);
    }

    const oldFiles = await readdir(destNew);

    for (const file of oldFiles) {
      await rename(`${destNew}/${file}`, `${destOld}/${file}`);
    }

    await rename(req.file.path, `${destNew}/${req.file.originalname}`);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    responseObject.error = 'Something went wrong';
    return responseObject;
  }

  const [first, other] = await uploadIos(
    `${domain}:${port}/public/${data.productid}/newios/${req.file.originalname}`,
    data.productid,
    req.session.userid,
  );

  responseObject.data.new = first;

  if (typeof other !== 'undefined' && other !== null) {
    responseObject.data.old = other;
  }

  responseObject.status = 'File uploaded';

  return responseObject;
}

export async function androidUploadService(req, data) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const mkdir = promisify(fs.mkdir);
  const rename = promisify(fs.rename);
  const readdir = promisify(fs.readdir);
  const unlink = promisify(fs.unlink);

  if (typeof req.file === 'undefined') {
    responseObject.error = 'No file uploaded';
    return responseObject;
  }

  const destNew = path.resolve(`./public/${data.productid}/newandroid/`);
  const destOld = path.resolve(`./public/${data.productid}/oldandroid/`);

  try {
    await mkdir(destNew, { recursive: true });
    await mkdir(destOld, { recursive: true });

    const clearFiles = await readdir(destOld);

    for (const file of clearFiles) {
      await unlink(`${destOld}/${file}`);
    }

    const oldFiles = await readdir(destNew);

    for (const file of oldFiles) {
      await rename(`${destNew}/${file}`, `${destOld}/${file}`);
    }

    await rename(req.file.path, `${destNew}/${req.file.originalname}`);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    responseObject.error = 'Something went wrong';
    return responseObject;
  }

  const [first, other] = await uploadAndroid(`${domain}:${port}/public/${data.productid}/newandroid/${req.file.originalname}`, data.productid, req.session.userid);

  responseObject.data.new = first;

  if (typeof other !== 'undefined' && other !== null) {
    responseObject.data.old = other;
  }

  responseObject.status = 'File uploaded';

  return responseObject;
}

export async function assignModelerService(data) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const result = await assignModeler(data);
  [responseObject.data] = result;
  responseObject.status = 'Modeller assigned';

  return responseObject;
}

export async function getModelersService() {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const result = await getModelers();

  result.forEach((modeler) => {
    responseObject.data[modeler.userid] = modeler;
  });

  responseObject.status = 'Modellers fetched';

  return responseObject;
}

export async function getModelsService(data) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const result = await getModels(data.orderid);
  result.forEach((model) => {
    responseObject.data[model.modelid] = model;
  });

  responseObject.status = 'Models fetched';

  return responseObject;
}

export async function getAllModelsService() {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const result = await getAllModels();
  result.forEach((model) => {
    responseObject.data[model.modelid] = model;
  });

  responseObject.status = 'Models fetched';

  return responseObject;
}

export async function getModellerModelsService(id) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const result = await getModellerModels(id);

  result.forEach((model) => {
    responseObject.data[model.modelid] = model;
  });

  responseObject.status = 'Models fetched';

  return responseObject;
}

export async function getProductsService(data) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const result = await getProducts(data.modelid);

  result.forEach((product) => {
    responseObject.data[product.productid] = product;
  });

  responseObject.status = 'Products fetched';

  return responseObject;
}
