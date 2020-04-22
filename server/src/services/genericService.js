import { comment, getComments, getLogin } from '../models/genericModel';

export async function commentService(data, userid) {
  const responseObject = {
    status: '',
    error: '',
    data: {},
  };

  const tempData = data;
  tempData.userid = userid;

  const result = await comment(tempData);

  if (typeof result.error !== 'undefined' && result.error !== '') {
    responseObject.error = result.error;
    return responseObject;
  }
  [responseObject.data] = result;
  responseObject.status = 'Comment made';
  return responseObject;
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
