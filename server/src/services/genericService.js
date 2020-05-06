import { comment, getComments, getLogin } from '../models/genericModel';
import { setOrderMissing, resolveOrderMissing } from '../models/orderModel';
import { setProductDoneModeller } from '../models/modelModel';

export async function commentService(data, req) {
  const responseObject = {
    status: '',
    error: '',
    data: {
      state: {},
      comment: {},
    },
  };

  const tempData = data;
  tempData.userid = req.session.userid;

  switch (true) {
    case data.commentclass === 'Comment': {
      if (data.comment === '') {
        responseObject.error = 'No comment made';
        return responseObject;
      }

      const result = await comment(tempData);

      if (typeof result.error !== 'undefined' && result.error !== '') {
        responseObject.error = result.error;
        return responseObject;
      }

      [responseObject.data.comment] = result;
      responseObject.status = 'Comment made';
      return responseObject;
    }

    case (
      data.commenttype === 'Order'
      && data.commentclass === 'Reject'
      && req.session.usertype === 'QA'
    ): {
      if (data.comment === '') {
        responseObject.error = 'Rejection rejected, need a comment';
        return responseObject;
      }

      const tempRes1 = await setOrderMissing(data.orderid, req.session.userid);
      if (tempRes1.status === 'f') {
        responseObject.error = 'Something went wrong';
        return responseObject;
      }

      const tempRes2 = await comment(tempData);
      if (typeof tempRes2.error !== 'undefined' && tempRes2.error !== '') {
        responseObject.error = tempRes2.error;
        return responseObject;
      }

      responseObject.status = 'Status set';
      responseObject.data.state = tempRes1;
      [responseObject.data.comment] = tempRes2;

      return responseObject;
    }

    case (
      data.commenttype === 'Order'
      && data.commentclass === 'Resolve'
      && req.session.usertype === 'QA'
    ): {
      const tempRes1 = await resolveOrderMissing(data.orderid, req.session.userid);
      if (tempRes1.status === 'f') {
        responseObject.error = 'Something went wrong';
        return responseObject;
      }

      if (data.comment !== '') {
        const tempRes2 = await comment(tempData);
        if (typeof tempRes2.error !== 'undefined' && tempRes2.error !== '') {
          responseObject.error = tempRes2.error;
          return responseObject;
        }
        [responseObject.data.comment] = tempRes2;
      }

      responseObject.status = 'Status set';
      responseObject.data.state = tempRes1;

      return responseObject;
    }

    case (
      data.commenttype === 'Product'
      && data.commentclass === 'Done'
      && req.session.usertype === 'Modeller'
    ): {
      const tempRes1 = await setProductDoneModeller(data.productid, req.session.userid);
      if (tempRes1.status === 'f') {
        responseObject.error = 'Something went wrong';
        return responseObject;
      }

      if (data.comment !== '') {
        const tempRes2 = await comment(tempData);
        if (typeof tempRes2.error !== 'undefined' && tempRes2.error !== '') {
          responseObject.error = tempRes2.error;
          return responseObject;
        }
        [responseObject.data.comment] = tempRes2;
      }

      responseObject.status = 'Product marked as done by modeller';
      responseObject.data.state = tempRes1;

      return responseObject;
    }

    default:
      responseObject.error = 'Faulty input';
      return responseObject;
  }
}

export async function getCommentsService(data) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  responseObject.data = await getComments(data);
  responseObject.status = 'Comments fetched';

  return responseObject;
}

export async function getLoginService(req) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  [responseObject.data] = await getLogin(req.session.userid);
  responseObject.status = 'Login fetched';

  return responseObject;
}
