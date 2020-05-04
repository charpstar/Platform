import bcrypt from 'bcrypt';
import {
  getUsers,
  getUserAmount,
  checkEmail,
  createUser,
  editUser,
  deleteUser,
  getUser,
} from '../models/userModel';

const saltRounds = 10;
const pepper = '55';

export async function loginService(credentials) {
  const responsObject = {
    status: '',
    error: '',
    data: {},
  };

  const userInfo = await checkEmail(credentials.email);

  if (typeof userInfo[0] === 'undefined') {
    responsObject.error = 'No account with this email';
    return responsObject;
  }

  if (!userInfo[0].active) {
    responsObject.error = 'Account is disabled';
    return responsObject;
  }

  const correctPassword = await bcrypt.compare(credentials.password + pepper, userInfo[0].hash);

  if (!correctPassword) {
    responsObject.error = 'Incorrect password';
    return responsObject;
  }

  [responsObject.data] = userInfo;
  delete responsObject.data.hash;
  delete responsObject.data.active;
  responsObject.status = 'Login successful';

  return responsObject;
}

export async function userCreationService(userData) {
  const responsObject = {
    status: '',
    error: '',
    data: {},
  };

  const checkData = await checkEmail(userData.email);

  if (typeof checkData[0] !== 'undefined' && checkData[0] !== null) {
    responsObject.error = 'Email already registered';
    return responsObject;
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

  if (typeof insertResult[0] === 'undefined') {
    responsObject.error = 'Something went wrong';
    return responsObject;
  }

  responsObject.status = 'User created';
  [responsObject.data] = insertResult;

  return responsObject;
}

export async function logoutService(session) {
  const responsObject = {
    status: '',
    error: '',
    data: {},
  };

  if (typeof session.userid === 'undefined') {
    session.destroy();
    responsObject.error = 'Not logged in';
    return responsObject;
  }

  session.destroy();
  responsObject.status = 'Logged out successfully';
  return responsObject;
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
  const responsObject = {
    status: '',
    error: '',
    data: {},
  };

  const users = await getUsers();

  users.forEach((user) => {
    responsObject.data[user.userid] = user;
  });

  responsObject.status = 'Users fetched';

  return responsObject;
}

export async function getUserService(data) {
  const responsObject = {
    status: '',
    error: '',
    data: {},
  };

  const users = await getUser(data.id);

  for (const user of users) {
    responsObject.data[user.userid] = user;
  }

  responsObject.status = 'User fetched';

  return responsObject;
}

export async function editUserService(userModification) {
  const responsObject = {
    status: '',
    error: '',
    data: {},
  };

  const userUpdate = userModification;

  if (typeof userModification.password !== 'undefined') {
    userUpdate.hash = await bcrypt.hash(userModification.password + pepper, saltRounds);
  }

  const result = await editUser(userUpdate);

  if (typeof result.error !== 'undefined' && result.error !== null) {
    responsObject.error = result.error;
    return responsObject;
  }

  if (typeof result[0] === 'undefined') {
    responsObject.error = 'something went wrong';
    return responsObject;
  }

  responsObject.status = 'Edit successfull';
  [responsObject.data] = result;

  return responsObject;
}

export async function deleteUserService(user) {
  const responsObject = {
    status: '',
    error: '',
    data: {},
  };

  const result = await deleteUser(user);

  if (result !== 1) {
    responsObject.error = 'something went wrong';
    return responsObject;
  }

  responsObject.status = 'Deletion successul';

  return responsObject;
}
