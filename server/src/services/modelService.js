import { getModelers, getModels, assignModeler } from '../models/modelModel';

export async function modelUploadService(data) {
  return data;
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
