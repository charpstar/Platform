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
  uploadmodelfile,
  assignmodeler,
  getmodelers,
  getmodels,
  getmodellermodels,
  getallmodels,
  getproducts,
  downloadmodelfile,
  listmodelfiles,
  uploadios,
  uploadandroid,
  deletemodelfile,
} from '../controllers/modelController';
import {
  createorder,
  getorders,
  claimorder,
  getclientorders,
} from '../controllers/orderController';
import { comment, getComments, getLogin } from '../controllers/genericController';

const upload = multer({ dest: './private/' });

const router = express.Router();

// Backend status
router.get('/', (req, res) => {
  res.send('Application running');
});

// Generic/Multi-use
router.get('/gen/login', getLogin);
router.post('/gen/comment', comment);
router.post('/gen/getComments', getComments);

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
router.post('/gen/getclientorders', getclientorders);

// Model related
router.get('/qa/getmodelers', getmodelers);
router.get('/modeller/models', getmodellermodels);
router.get('/qa/getallmodels', getallmodels);
router.post('/modeller/listmodelfiles', listmodelfiles);
router.post('/qa/assignmodeler', assignmodeler);
router.post('/gen/getmodels', getmodels);
router.post('/modeller/uploadmodelfile', upload.single('modelfile'), uploadmodelfile);
router.post('/gen/getproducts', getproducts);
router.post('/modeller/downloadmodelfile', downloadmodelfile);
router.post('/qa/uploadios', upload.single('modelfile'), uploadios);
router.post('/qa/uploadandroid', upload.single('modelfile'), uploadandroid);
router.post('/modeller/deletemodelfile', deletemodelfile);

export default router;
