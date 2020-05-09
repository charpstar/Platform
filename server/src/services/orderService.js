import xlsx from 'xlsx';
import fs from 'fs-extra';
import path from 'path';
import {
  createOrder,
  getOrders,
  claimOrder,
  getExcel,
  deleteOrder,
} from '../models/orderModel';

export async function getOrdersService(filter) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const result = await getOrders(filter);
  result.forEach((order) => {
    responseObject.data[order.orderid] = order;
  });
  responseObject.status = 'Orders fetched';
  return responseObject;
}

export async function getOrderService(filter) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const result = await getOrders(filter);
  [responseObject.data] = result;
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

export async function getExcelService(data) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const tempRes = await getExcel(data.id);

  const parsed = [];

  for (const product of tempRes) {
    if (product.state !== 'Done') {
      parsed.push({
        name: product.name,
        color: product.color,
        link: product.link,
        androidlink: null,
        ioslink: null,
        state: product.state,
      });
    } else {
      parsed.push({
        name: product.name,
        color: product.color,
        link: product.link,
        androidlink: null,
        ioslink: null,
        state: product.state,
      });
    }
  }

  const fitToColumn = (objectArray) => {
    const columnWidths = [];
    for (const property in objectArray[0]) {
      if (Object.prototype.hasOwnProperty.call(objectArray[0], property)) {
        columnWidths.push({
          wch: Math.max(
            property
              ? property.toString().length + 15
              : 0,
            ...objectArray.map((obj) => (
              obj[property]
                ? obj[property].toString().length + 15
                : 0
            )),
          ),
        });
      }
    }
    return columnWidths;
  };

  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(parsed);
  xlsx.utils.book_append_sheet(wb, ws, 'Products');
  ws['!cols'] = fitToColumn(parsed);
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
  try {
    fs.remove(req.file.path);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }


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
    } else {
      errorText = 'At least 1 missing colour';
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

  responseObject.orderid = res.orderid;

  return responseObject;
}

export async function deleteOrderService(data) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const orderData = await deleteOrder(data);

  try {
    for (const productid of orderData.productids) {
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
    for (const modelid of orderData.modelids) {
      const deletionPath = path.resolve(`./private/${modelid}/`);
      await fs.remove(deletionPath, { recursive: true });
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    responseObject.error = 'There was an error trying to remove a model';
    return responseObject;
  }

  try {
    const deletionPath = path.resolve(`./private/${data.orderid}.xlsx`);
    await fs.remove(deletionPath);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    responseObject.error = 'There was an error trying to remove an excel file';
    return responseObject;
  }

  responseObject.status = 'Order removed';

  return responseObject;
}
