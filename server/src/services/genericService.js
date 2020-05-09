import {
  comment,
  getComments,
  editComment,
  deleteComment,
} from '../models/genericModel';
import { setOrderMissing, resolveOrderMissing } from '../models/orderModel';
import {
  setProductDoneModeller,
  approveProductQA,
  approveProductClient,
  rejectProductQA,
  rejectProductClient,
  setProductMissing,
  resolveProductMissing,
  approveModelQA,
  setModelDoneModeller,
  approveModelClient,
  rejectModelQA,
  rejectModelClient,
  setModelMissing,
  resolveModelMissing,
} from '../models/modelModel';

const stateChangeFunctions = {
  Order: {
    QA: {
      Info: setOrderMissing,
      Resolve: resolveOrderMissing,
    },
  },
  Model: {
    QA: {
      Approve: approveModelQA,
      Reject: rejectModelQA,
      Info: setModelMissing,
      Resolve: resolveModelMissing,
    },
    Modeller: {
      Done: setModelDoneModeller,
      Info: setModelMissing,
    },
    Client: {
      Approve: approveModelClient,
      Reject: rejectModelClient,
    },
  },
  Product: {
    QA: {
      Approve: approveProductQA,
      Reject: rejectProductQA,
      Resolve: resolveProductMissing,
      Info: setProductMissing,
    },
    Modeler: {
      Done: setProductDoneModeller,
      Info: setProductMissing,
    },
    Client: {
      Approve: approveProductClient,
      Reject: rejectProductClient,
    },
  },
};
export async function changeStateService(data, req) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };
  let stateFunction = stateChangeFunctions[data.commenttype][req.session.usertype];
  if (stateFunction == null) {
    responseObject.error = 'This state change is not allowed';
    return responseObject;
  }
  stateFunction = stateFunction[data.commentclass];
  if (stateFunction == null) {
    responseObject.error = 'This state change is not allowed';
    return responseObject;
  }

  const id = ((commenttype) => {
    switch (commenttype) {
      case 'Order':
        return data.orderid;
      case 'Model':
        return data.modelid;
      case 'Product':
        return data.productid;
      default:
        return null;
    }
  })(data.commenttype);

  const result = await stateFunction(id, req.session.userid);
  if (result.status === 'f') {
    responseObject.error = 'Something went wrong';
    return responseObject;
  }
  responseObject.data.state = result;
  return responseObject;
}

export async function createCommentService(data, req) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const tempData = data;
  tempData.userid = req.session.userid;

  const result = await comment(tempData);

  if (typeof result.error !== 'undefined' && result.error !== '') {
    responseObject.error = result.error;
    return responseObject;
  }

  for (const tempComment of result) {
    responseObject.data[tempComment.commentid] = tempComment;
  }

  responseObject.status = 'Comment made';

  return responseObject;
}

export async function editCommentService(data, req) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const tempData = data;
  tempData.userid = req.session.userid;

  const result = await editComment(tempData);

  if (typeof result.error !== 'undefined' && result.error !== '') {
    responseObject.error = result.error;
    return responseObject;
  }

  for (const tempComment of result) {
    responseObject.data[tempComment.commentid] = tempComment;
  }

  responseObject.status = 'Comment edited';

  return responseObject;
}

export async function deleteCommentService(data, req) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const tempData = data;
  tempData.userid = req.session.userid;

  const result = await deleteComment(tempData);

  if (typeof result.error !== 'undefined' && result.error !== '') {
    responseObject.error = result.error;
    return responseObject;
  }

  for (const tempComment of result) {
    responseObject.data[tempComment.commentid] = tempComment;
  }

  responseObject.status = 'Comment deleted';

  return responseObject;
}

export async function getCommentsService(data) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const result = await getComments(data);

  for (const tempComment of result) {
    responseObject.data[tempComment.commentid] = tempComment;
  }

  responseObject.status = 'Comments fetched';

  return responseObject;
}
