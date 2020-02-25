import bcrypt from 'bcrypt';
import { checkEmail, createUser } from '../models/userModel';

const saltRounds = 10;
const pepper = '55';

export async function loginService(credentials) {
  const userInfo = await checkEmail(credentials.email);

  if (typeof userInfo[0] === 'undefined') {
    return { error: 'No account with this email' };
  }

  if (!userInfo[0].active) {
    return { error: 'Account is disabled' };
  }

  const correctPassword = await bcrypt.compare(credentials.password + pepper, userInfo[0].hash);

  if (!correctPassword) {
    return { error: 'Incorrect password' };
  }

  return userInfo[0];
}

export async function userCreationService(userData) {
  const checkData = await checkEmail(userData.email);

  if (typeof checkData[0] !== 'undefined' && checkData[0] !== null) {
    return { error: 'Email already registered' };
  }

  const data = {
    usertype: userData.usertype,
    email: userData.email,
    name: userData.name,
    hash: '',
    active: userData.active,
  };

  data.hash = await bcrypt.hash(userData.password + pepper, saltRounds);

  const insertResult = await createUser(data);

  if (!insertResult.rowCount) {
    return 'Something went wrong';
  }

  return { status: 'User created' };
}

export async function logoutService(session) {
  if (typeof session.userid === 'undefined') {
    session.destroy();
    return { error: 'Not logged in' };
  }

  session.destroy();
  return { status: 'Logged out successully' };
}
