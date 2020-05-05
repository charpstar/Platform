import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import {
  createOrder,
  getOrders,
  claimOrder,
  getClientOrders,
  getExcel,
  getOrder,
  setOrderMissing,
  resolveOrderMissing,
} from '../models/orderModel';

export async function orderCreationService(req) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  if (typeof req.file === 'undefined' || req.file === null) {
    responseObject.error = 'No file was uploaded';
    return responseObject;
  }

  const file = xlsx.readFile(req.file.path);
  const sheets = file.SheetNames;
  const rawData = xlsx.utils.sheet_to_json(file.Sheets[sheets[0]]);
  fs.unlink(req.file.path, (err) => {
    if (err) {
      throw err;
    }
  });

  const data = {};
  const models = [];
  let errorText = '';

  rawData.forEach((row) => {
    const tempData = {};
    if (typeof row['Name of product'] !== 'undefined' && row['Name of product'] !== null) {
      tempData.name = row['Name of product'];
    } else {
      errorText = 'At least 1 missing name';
    }
    if (typeof row['Store Link'] !== 'undefined' && row['Store Link'] !== null) {
      tempData.link = row['Store Link'];
    } else {
      errorText = 'At least 1 missing link';
    }
    if (typeof row['Color/Material'] !== 'undefined' && row['Color/Material'] !== null) {
      tempData.color = row['Color/Material'];
    }
    models.push(tempData);
  });

  if (errorText !== '') {
    responseObject.error = errorText;
    return responseObject;
  }

  data.clientid = req.session.userid;

  const parsedModels = {};

  models.forEach((x) => {
    if (x && x.name) {
      parsedModels[x.name] = parsedModels[x.name] || { name: x.name, products: [] };
      parsedModels[x.name].products.push({
        color: x.color,
        link: x.link,
      });
    }
  });

  data.models = parsedModels;
  const res = await createOrder(data);
  if (typeof res.error !== 'undefined' && res.error !== '') {
    responseObject.error = res.error;
    return responseObject;
  }

  [responseObject.data] = res;
  responseObject.status = 'Order successful';

  return responseObject;
}

export async function getOrdersService() {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const result = await getOrders();
  result.forEach((order) => {
    responseObject.data[order.orderid] = order;
  });
  responseObject.status = 'Orders fetched';
  return responseObject;
}

export async function getOrderService(data) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const result = await getOrder(data.id);
  for (const order of result) {
    responseObject.data[order.orderid] = order;
  }
  responseObject.status = 'Order fetched';
  return responseObject;
}

export async function claimOrderService(orderid, userid) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const tempRes = await claimOrder(orderid, userid);
  if (tempRes.status === 'f') {
    responseObject.error = 'No such order';
    return responseObject;
  }

  responseObject.status = 'Claim successful';
  [responseObject.data] = tempRes.data;

  return responseObject;
}

export async function getClientOrdersService(client) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const result = await getClientOrders(client.id);

  result.forEach((order) => {
    responseObject.data[order.orderid] = order;
  });

  responseObject.status = 'Orders fetched';

  return responseObject;
}

export async function getExcelService(data) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const tempRes = await getExcel(data.id);
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(tempRes);
  xlsx.utils.book_append_sheet(wb, ws, 'Products');
  try {
    xlsx.writeFile(wb, `./private/${data.id}.xlsx`);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    responseObject.error = "Coudn't create excel file";
    return responseObject;
  }

  const filePath = path.resolve(`./private/${data.id}.xlsx`);

  return filePath;
}

export async function setOrderMissingService(data, req) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const tempRes = await setOrderMissing(data.id, req.session.userid);
  if (tempRes.status === 'f') {
    responseObject.error = 'Something went wrong';
    return responseObject;
  }

  responseObject.status = 'Status updated';
  responseObject.data = tempRes;

  return responseObject;
}

export async function resolveOrderMissingService(data, req) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const tempRes = await resolveOrderMissing(data.id, req.session.userid);
  if (tempRes.status === 'f') {
    responseObject.error = 'Something went wrong';
    return responseObject;
  }

  responseObject.status = 'Status updated';
  responseObject.data[data.id] = tempRes.orderstatus;

  return responseObject;
}
