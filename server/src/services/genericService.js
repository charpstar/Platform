import { comment } from '../models/genericModel';

export async function commentService(data, userid) {
  return comment(data, userid);
}

export async function tempService() {
  return { temp: 'temp' };
}
