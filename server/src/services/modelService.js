import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import {
  getModelers,
  getModels,
  assignModeler,
  uploadModel,
} from '../models/modelModel';

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
    const dest = path.resolve(`./public/${data.productid}/`);
    await mkdir(dest, { recursive: true });
    await rename(req.file.path, `${dest}/${req.file.originalname}`);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    responseObject.error = 'Something went wrong';
    return responseObject;
  }

  const modelPath = `/public/${data.productid}/${req.file.originalname}`;
  const ext = path.extname(modelPath);

  const result = await uploadModel(modelPath, ext, data.productid);

  [responseObject.data] = result;
  responseObject.status = 'Model uploaded';

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
