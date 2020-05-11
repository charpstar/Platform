import Joi from 'joi';
import { validateAndRunService, runServiceWithData } from './controllerFunctions';
import {
  modelUploadService,
  assignModelerService,
  getModelsService,
  getModelService,
  getProductsService,
  modelFileDownloadService,
  listModelFilesService,
  iosUploadService,
  androidUploadService,
  modelFileDeleteService,
  thumbUploadService,
  deleteModelService,
  deleteProductService,
  editProductLinkService,
  editProductModelIdService,
  editModelNameService,
  newModelsService,
  newProductsService,
} from '../services/modelService';

const orderIdParser = Joi.object({
  orderid: Joi.number()
    .integer()
    .min(0)
    .required(),
});

const deleteModelFileParser = Joi.object({
  modelid: Joi.number()
    .integer()
    .min(0)
    .required(),

  filename: Joi.string()
    .required(),
});

const modelAssignmentParser = Joi.object({
  modelid: Joi.number()
    .integer()
    .min(0)
    .required(),

  modelerid: Joi.number()
    .integer()
    .min(0)
    .required(),
});

const modelFileParser = Joi.object({
  modelid: Joi.number()
    .integer()
    .min(0)
    .required(),
});

const productIdParser = Joi.object({
  productid: Joi.number()
    .integer()
    .min(0)
    .required(),
});

const modelFileDownloadParser = Joi.object({
  modelid: Joi.number()
    .integer()
    .min(0)
    .required(),

  filename: Joi.string()
    .required(),
});

const modelIdParser = Joi.object({
  modelid: Joi.number()
    .integer()
    .min(0)
    .required(),
});

const editProductLinkParser = Joi.object({
  productid: Joi.number()
    .integer()
    .min(0)
    .required(),

  newlink: Joi.string()
    .uri()
    .required(),
});

const editProductModelIdParser = Joi.object({
  productid: Joi.number()
    .integer()
    .min(0)
    .required(),

  newmodelid: Joi.number()
    .integer()
    .min(0)
    .required(),
});

const editModelNameParser = Joi.object({
  modelid: Joi.number()
    .integer()
    .min(0)
    .required(),

  newname: Joi.string()
    .required(),
});

const modelOwnerParser = Joi.object({
  modelowner: Joi.number()
    .integer()
    .min(0)
    .required(),
});

export async function uploadmodelfile(req, res) {
  return validateAndRunService(modelFileParser, modelUploadService, req, res);
}

export async function downloadmodelfile(req, res) {
  try {
    const { error, value } = modelFileDownloadParser.validate(req.body);
    if (typeof error !== 'undefined' && error !== null) {
      const responseObject = {
        status: '',
        error: error.details[0].message,
        data: {},
      };
      return res.send(responseObject);
    }
    return modelFileDownloadService(value).then((result) => {
      res.download(result);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return res.send('Failed');
  }
}

export async function deletemodelfile(req, res) {
  return validateAndRunService(deleteModelFileParser, modelFileDeleteService, req, res);
}

export async function uploadthumb(req, res) {
  return validateAndRunService(modelFileParser, thumbUploadService, req, res);
}

export async function listmodelfiles(req, res) {
  return validateAndRunService(modelIdParser, listModelFilesService, req, res);
}

export async function uploadios(req, res) {
  return validateAndRunService(productIdParser, iosUploadService, req, res);
}

export async function uploadandroid(req, res) {
  return validateAndRunService(productIdParser, androidUploadService, req, res);
}

export async function assignmodeler(req, res) {
  return validateAndRunService(modelAssignmentParser, assignModelerService, req, res);
}

export async function getmodels(req, res) {
  return validateAndRunService(orderIdParser, getModelsService, req, res);
}

export async function getmodel(req, res) {
  return validateAndRunService(modelIdParser, getModelService, req, res);
}

export async function getallmodels(req, res) {
  return runServiceWithData(getModelsService, {}, req, res);
}

export async function getmodellermodels(req, res) {
  return validateAndRunService(modelOwnerParser, getModelsService, req, res);
}

export async function getproducts(req, res) {
  return validateAndRunService(modelIdParser, getProductsService, req, res);
}

export async function deletemodel(req, res) {
  validateAndRunService(modelIdParser, deleteModelService, req, res);
}

export async function deleteproduct(req, res) {
  validateAndRunService(productIdParser, deleteProductService, req, res);
}

export async function editproductlink(req, res) {
  validateAndRunService(editProductLinkParser, editProductLinkService, req, res);
}

export async function editproductmodelid(req, res) {
  validateAndRunService(editProductModelIdParser, editProductModelIdService, req, res);
}

export async function editmodelname(req, res) {
  validateAndRunService(editModelNameParser, editModelNameService, req, res);
}

export async function newmodels(req, res) {
  validateAndRunService(orderIdParser, newModelsService, req, res);
}

export async function newproducts(req, res) {
  validateAndRunService(modelIdParser, newProductsService, req, res);
}
