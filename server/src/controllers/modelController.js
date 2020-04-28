import Joi from 'joi';
import {
  modelUploadService,
  assignModelerService,
  getModelersService,
  getModelsService,
  getModellerModelsService,
  getAllModelsService,
  getProductsService,
  modelFileDownloadService,
  listModelFilesService,
  iosUploadService,
  androidUploadService,
} from '../services/modelService';

const orderIdParser = Joi.object({
  orderid: Joi.number()
    .integer()
    .min(0)
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

const productFileParser = Joi.object({
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

export async function uploadmodelfile(req, res) {
  try {
    const { error, value } = modelFileParser.validate(req.body);
    if (typeof error !== 'undefined' && error !== null) {
      const responseObject = {
        status: '',
        error: error.details[0].message,
        data: {},
      };
      return res.send(responseObject);
    }
    return modelUploadService(req, value).then((result) => res.send(result));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return res.send('Failed');
  }
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
    return modelFileDownloadService(value).then((result) => res.download(result));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return res.send('Failed');
  }
}

export async function listmodelfiles(req, res) {
  try {
    const { error, value } = modelIdParser.validate(req.body);
    if (typeof error !== 'undefined' && error !== null) {
      const responseObject = {
        status: '',
        error: error.details[0].message,
        data: {},
      };
      return res.send(responseObject);
    }
    return listModelFilesService(value).then((result) => res.send(result));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return res.send('Failed');
  }
}

export async function uploadios(req, res) {
  try {
    const { error, value } = productFileParser.validate(req.body);
    if (typeof error !== 'undefined' && error !== null) {
      const responseObject = {
        status: '',
        error: error.details[0].message,
        data: {},
      };
      return res.send(responseObject);
    }
    return iosUploadService(req, value).then((result) => res.send(result));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return res.send('Failed');
  }
}

export async function uploadandroid(req, res) {
  try {
    const { error, value } = productFileParser.validate(req.body);
    if (typeof error !== 'undefined' && error !== null) {
      const responseObject = {
        status: '',
        error: error.details[0].message,
        data: {},
      };
      return res.send(responseObject);
    }
    return androidUploadService(req, value).then((result) => res.send(result));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return res.send('Failed');
  }
}

export async function assignmodeler(req, res) {
  try {
    const { error, value } = modelAssignmentParser.validate(req.body);
    if (typeof error !== 'undefined' && error !== null) {
      const responseObject = {
        status: '',
        error: error.details[0].message,
        data: {},
      };
      res.send(responseObject);
    }
    return assignModelerService(value).then((result) => {
      res.send(result);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return res.send('Failed');
  }
}

export async function getmodelers(req, res) {
  try {
    return getModelersService().then((result) => {
      res.send(result);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return res.send('Failed');
  }
}

export async function getmodels(req, res) {
  try {
    const { error, value } = orderIdParser.validate(req.body);
    if (typeof error !== 'undefined' && error !== null) {
      const responseObject = {
        status: '',
        error: error.details[0].message,
        data: {},
      };
      return res.send(responseObject);
    }
    return getModelsService(value).then((result) => {
      res.send(result);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return res.send('Failed');
  }
}

export async function getallmodels(req, res) {
  try {
    return getAllModelsService().then((result) => {
      res.send(result);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return res.send('Failed');
  }
}

export async function getmodellermodels(req, res) {
  try {
    return getModellerModelsService(req.session.userid).then((result) => {
      res.send(result);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return res.send('Failed');
  }
}

export async function getproducts(req, res) {
  try {
    const { error, value } = modelIdParser.validate(req.body);
    if (typeof error !== 'undefined' && error !== null) {
      const responseObject = {
        status: '',
        error: error.details[0].message,
        data: {},
      };
      return res.send(responseObject);
    }
    return getProductsService(value).then((result) => {
      res.send(result);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return res.send('Failed');
  }
}
