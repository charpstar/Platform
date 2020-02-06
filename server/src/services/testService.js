import { getNames, getNameUsingId } from '../models/testModel';

export async function getNameService() {
  return getNames();
}

export async function getIdService(id) {
  return getNameUsingId(id);
}
