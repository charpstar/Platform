import path from 'path';
import fs from 'fs-extra';
import {
  getModels,
  assignModeler,
  getProducts,
  uploadIos,
  uploadAndroid,
  uploadModelFile,
  deleteModelFile,
  listModelFiles,
  deleteProduct,
  deleteModel,
  editProductLink,
  editProductModelId,
  editModelName,
} from '../models/modelModel';
import { domain, port } from '../config/config';

export async function modelUploadService(data, req) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  if (typeof req.file === 'undefined') {
    responseObject.error = 'No file uploaded';
    return responseObject;
  }

  try {
    const dest = path.resolve(`./private/${data.modelid}/`);
    await fs.mkdirs(dest, { recursive: true });
    await fs.move(req.file.path, `${dest}/${req.file.originalname}`, { overwrite: true });
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

export async function modelFileDeleteService(data) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const deletionPath = path.resolve(`./private/${data.modelid}/${data.filename}`);

  try {
    await fs.remove(deletionPath);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    responseObject.error = 'No such file';
    return responseObject;
  }

  deleteModelFile(data);

  responseObject.status = 'File deleted';
  return responseObject;
}

export async function thumbUploadService(data, req) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const thumbsFolder = path.resolve('./public/thumbs/');
  const fileExt = path.extname(req.file.originalname);

  try {
    await fs.mkdirs(thumbsFolder, { recursive: true });
    fs.move(req.file.path, `${thumbsFolder}/${data.modelid}${fileExt}`, { overwrite: true });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    responseObject.error = 'Something went wrong';
    return responseObject;
  }

  responseObject.status = 'Thumbnail uploaded';

  return responseObject;
}

export async function listModelFilesService(data) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const tempRes = await listModelFiles(data.modelid);

  for (const file of tempRes) {
    responseObject.data[file.time] = file.filename;
  }

  responseObject.status = 'Files fetched';

  return responseObject;
}

export async function iosUploadService(data, req) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  if (typeof req.file === 'undefined') {
    responseObject.error = 'No file uploaded';
    return responseObject;
  }

  const destNew = path.resolve(`./public/${data.productid}/newios/`);
  const destOld = path.resolve(`./public/${data.productid}/oldios/`);

  try {
    await fs.mkdirs(destNew, { recursive: true });
    await fs.mkdirs(destOld, { recursive: true });

    const clearFiles = await fs.readdir(destOld);

    for (const file of clearFiles) {
      await fs.remove(`${destOld}/${file}`);
    }

    const oldFiles = await fs.readdir(destNew);

    for (const file of oldFiles) {
      await fs.move(`${destNew}/${file}`, `${destOld}/${file}`);
    }

    await fs.move(req.file.path, `${destNew}/${req.file.originalname}`);
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

export async function androidUploadService(data, req) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  if (typeof req.file === 'undefined') {
    responseObject.error = 'No file uploaded';
    return responseObject;
  }

  const destNew = path.resolve(`./public/${data.productid}/newandroid/`);
  const destOld = path.resolve(`./public/${data.productid}/oldandroid/`);

  try {
    await fs.mkdirs(destNew, { recursive: true });
    await fs.mkdirs(destOld, { recursive: true });

    const clearFiles = await fs.readdir(destOld);

    for (const file of clearFiles) {
      await fs.remove(`${destOld}/${file}`);
    }

    const oldFiles = await fs.readdir(destNew);

    for (const file of oldFiles) {
      await fs.move(`${destNew}/${file}`, `${destOld}/${file}`);
    }

    await fs.move(req.file.path, `${destNew}/${req.file.originalname}`);
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

export async function assignModelerService(data, req) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const result = await assignModeler(data, req.session.userid);
  if (result.status === 'f') {
    responseObject.error = 'Something went wrong';
    return responseObject;
  }
  [responseObject.data] = result.data;
  responseObject.status = 'Modeller assigned';

  return responseObject;
}

export async function getModelsService(filter) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const result = await getModels(filter);

  responseObject.data = result;
  responseObject.status = 'Models fetched';

  return responseObject;
}

export async function getModelService(filter) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const result = await getModels(filter);

  [responseObject.data] = Object.values(result);
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

export async function deleteModelService(data) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const productIds = await deleteModel(data);

  try {
    for (const productid of productIds) {
      const deletionPath = path.resolve(`./public/${productid}/`);
      const deleteThumb = path.resolve(`./public/thumbs/${productid}.png`);
      await fs.remove(deletionPath, { recursive: true });
      await fs.remove(deleteThumb);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    responseObject.error = 'There was an error trying to remove a product';
    return responseObject;
  }

  try {
    const deletionPath = path.resolve(`./private/${data.modelid}/`);
    await fs.remove(deletionPath, { recursive: true });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    responseObject.error = 'There was an error trying to remove the model';
    return responseObject;
  }

  responseObject.status = 'Model removed';

  return responseObject;
}

export async function deleteProductService(data) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  await deleteProduct(data);

  const deletionPath = path.resolve(`./public/${data.productid}/`);
  const deleteThumb = path.resolve(`./public/thumbs/${data.productid}.png`);

  try {
    await fs.remove(deletionPath, { recursive: true });
    await fs.remove(deleteThumb);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    responseObject.error = 'There was an error trying to remove the product';
    return responseObject;
  }

  responseObject.status = 'Product removed';

  return responseObject;
}

export async function editProductLinkService(data) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const result = await editProductLink(data);

  for (const product of result) {
    responseObject.data[product.productid] = product;
  }

  responseObject.status = 'Product link updated';

  return responseObject;
}

export async function editProductModelIdService(data) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const result = await editProductModelId(data);

  for (const product of result) {
    responseObject.data[product.productid] = product;
  }

  responseObject.status = 'Product model id updated';

  return responseObject;
}

export async function editModelNameService(data) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const result = await editModelName(data);

  for (const model of result) {
    responseObject.data[model.modelid] = model;
  }

  responseObject.status = 'Model name updated';

  return responseObject;
}
