import express from 'express';
import multer from 'multer';
import {
  login,
  createuser,
  logout,
  getusers,
  edituser,
  deleteuser,
} from '../controllers/userController';
import {
  uploadmodel,
  assignmodeler,
  getmodelers,
  getmodels,
} from '../controllers/modelController';
import { createorder, getorders, claimorder } from '../controllers/orderController';
import { comment } from '../controllers/genericController';

const upload = multer({ dest: './private/' });

const router = express.Router();

// Backend status
router.get('/', (req, res) => {
  res.send('Application running');
});

// Generic/Multi-use
router.post('/gen/comment', comment);

// User related
router.get('/logout', logout);
router.get('/admin/getusers', getusers);
router.post('/login', login);
router.post('/admin/createuser', createuser);
router.post('/admin/edituser', edituser);
router.post('/admin/deleteuser', deleteuser);

// Order related
router.get('/qa/getorders', getorders);
router.post('/client/createorder', upload.single('orderdata'), createorder);
router.post('/qa/claimorder', claimorder);

// Model related
router.get('/qa/getmodelers', getmodelers);
router.post('/uploadmodel', uploadmodel);
router.post('/qa/assignmodeler', assignmodeler);
router.post('/qa/getmodels', getmodels);
export default router;
