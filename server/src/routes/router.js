import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  login,
  createuser,
  logout,
  getusers,
  edituser,
  deleteuser,
  getuser,
  getmodelers,
} from '../controllers/userController';
import {
  uploadmodelfile,
  assignmodeler,
  getmodels,
  getmodellermodels,
  getallmodels,
  getproducts,
  downloadmodelfile,
  listmodelfiles,
  uploadios,
  uploadandroid,
  deletemodelfile,
  uploadthumb,
  getmodel,
  deletemodel,
  deleteproduct,
  editproductlink,
  editproductmodelid,
  editmodelname,
  newmodels,
} from '../controllers/modelController';
import {
  createorder,
  getorders,
  claimorder,
  getclientorders,
  getexcel,
  getorder,
  assignorder,
  deleteorder,
} from '../controllers/orderController';
import {
  comment,
  getcomments,
  getlogin,
  editcomment,
  deletecomment,
} from '../controllers/genericController';

const uploadXlsx = multer({
  dest: './private/',
  fileFilter: (req, file, cb) => {
    const allowedExtNames = /xlsx/;
    const allowedMimeTypes = /application\/vnd.openxmlformats-officedocument.spreadsheetml.sheet/;
    const mimeType = allowedMimeTypes.test(file.mimetype);
    const extName = allowedExtNames.test(path.extname(file.originalname).toLowerCase());

    if (mimeType && extName) {
      return cb(null, true);
    }
    return cb(`Error: File upload only support the following filetypes - ${allowedExtNames}`, false);
  },
});

const uploadGlb = multer({
  dest: './private/',
  fileFilter: (req, file, cb) => {
    const allowedExtNames = /glb/;
    const extName = allowedExtNames.test(path.extname(file.originalname).toLowerCase());

    if (extName) {
      return cb(null, true);
    }
    return cb(`Error: File upload only support the following filetypes - ${allowedExtNames}`, false);
  },
});

const uploadUsdz = multer({
  dest: './private/',
  fileFilter: (req, file, cb) => {
    const allowedExtNames = /usdz/;
    const extName = allowedExtNames.test(path.extname(file.originalname).toLowerCase());

    if (extName) {
      return cb(null, true);
    }
    return cb(`Error: File upload only support the following filetypes - ${allowedExtNames}`, false);
  },
});

const uploadImage = multer({
  dest: './private/',
  fileFilter: (req, file, cb) => {
    return cb(null, true);
  },
});

const upload = multer({ dest: './private/' });

const router = express.Router();

// Backend status
router.get('/', (req, res) => {
  res.send('Application running');
});

// Generic/Multi-use
router.get('/gen/login', getlogin);
router.post('/gen/comment', comment);
router.post('/gen/getcomments', getcomments);
router.post('/gen/editcomment', editcomment);
router.post('/gen/deletecomment', deletecomment);
router.post('/gen/getexcel', getexcel);


// User related
router.get('/logout', logout);
router.post('/login', login);
router.get('/qa/getusers', getusers);
router.post('/qa/getuser', getuser);
router.get('/qa/getmodelers', getmodelers);
router.post('/admin/createuser', createuser);
router.post('/admin/edituser', edituser);
router.post('/admin/deleteuser', deleteuser);

// Order related
router.get('/qa/getorders', getorders);
router.post('/client/createorder', uploadXlsx.single('orderdata'), createorder);
router.post('/qa/claimorder', claimorder);
router.post('/admin/assignorder', assignorder);
router.post('/gen/getclientorders', getclientorders);
router.post('/gen/getorder', getorder);
router.post('/qa/deleteorder', deleteorder);

// Model related
router.post('/modeller/models', getmodellermodels);
router.get('/qa/getallmodels', getallmodels);
router.post('/modeller/listmodelfiles', listmodelfiles);
router.post('/qa/assignmodeler', assignmodeler);
router.post('/gen/getmodels', getmodels);
router.post('/modeller/uploadmodelfile', upload.single('modelfile'), uploadmodelfile);
router.post('/gen/getproducts', getproducts);
router.post('/modeller/downloadmodelfile', downloadmodelfile);
router.post('/qa/uploadios', uploadUsdz.single('modelfile'), uploadios);
router.post('/qa/uploadandroid', uploadGlb.single('modelfile'), uploadandroid);
router.post('/modeller/deletemodelfile', deletemodelfile);
router.post('/qa/uploadthumb', uploadImage.single('thumb'), uploadthumb);
router.post('/gen/getmodel', getmodel);
router.post('/qa/deletemodel', deletemodel);
router.post('/qa/deleteproduct', deleteproduct);
router.post('/client/editproductlink', editproductlink);
router.post('/qa/editproductmodelid', editproductmodelid);
router.post('/qa/editmodelname', editmodelname);
router.post('/client/newmodels', uploadXlsx.single('modeldata'), newmodels);


export default router;
