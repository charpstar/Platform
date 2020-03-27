import bcrypt from 'bcrypt';
import {
  getUsers,
  getUserAmount,
  checkEmail,
  createUser,
  editUser,
  deleteUser,
} from '../models/userModel';

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

export async function initUserCreationService() {
  const users = await getUserAmount();

  if (users[0].count > 0) {
    return 'No need to create root user';
  }

  const rootUser = {
    name: 'root',
    email: 'root@charpstar.com',
    usertype: 'Admin',
    hash: '',
    active: 'true',
  };

  const rootPw = 'root';

  rootUser.hash = await bcrypt.hash(rootPw + pepper, saltRounds);

  const insertResult = await createUser(rootUser);

  // eslint-disable-next-line no-console
  console.log('Root user created');

  return insertResult;
}

export async function getUsersService() {
  const users = await getUsers();

  return users;
}

export async function editUserService(userModification) {
  const userUpdate = userModification;

  if (typeof userModification.password !== 'undefined') {
    userUpdate.hash = await bcrypt.hash(userModification.password + pepper, saltRounds);
  }

  const result = await editUser(userUpdate);

  if (result !== 1) {
    return { error: 'something went wrong' };
  }

  return { status: 'Edit successfull' };
}

export async function deleteUserService(user) {
  const result = await deleteUser(user);

  if (result !== 1) {
    return { error: 'something went wrong' };
  }

  return { status: 'deletion successful' };
}
