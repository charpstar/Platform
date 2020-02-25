import express from 'express';
import { login, createuser, logout } from '../controllers/userController';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Application running');
});

router.post('/login', login);

router.post('/admin/createuser', createuser);

router.get('/logout', logout);

export default router;
