import { getModelers, getModels, assignModeler } from '../models/modelModel';

export async function modelUploadService(data) {
  return data;
}

export async function assignModelerService(data) {
  return assignModeler(data);
}

export async function getModelersService() {
  return getModelers();
}

export async function getModelsService(data) {
  return getModels(data.orderid);
}
