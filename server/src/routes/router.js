import express from 'express';
import { listNames, getId } from '../controllers/testController';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Application running');
});

router.get('/names', listNames);

router.post('/id', getId);

export default router;
