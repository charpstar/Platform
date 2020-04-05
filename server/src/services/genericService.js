import { comment, getComments } from '../models/genericModel';

export async function commentService(data, userid) {
  const tempData = data;
  tempData.userid = userid;
  return comment(tempData);
}

export async function getCommentsService(data) {
  return getComments(data);
}
