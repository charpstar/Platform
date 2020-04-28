import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import helmet from 'helmet';
import session from 'express-session';
import pg from 'pg';
import connectPgSimple from 'connect-pg-simple';
import { port } from './config/config';
import router from './routes/router';
import {
  adminAuth,
  qaAuth,
  modellerAuth,
  clientAuth,
  genericAuth,
} from './middleware/auth';
import { initUserCreationService } from './services/userService.js';

const envFetch = dotenv.config();

if (envFetch.error) {
  throw envFetch.error;
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));
app.use(morgan('combined'));
app.use(helmet());
app.use(cors({
  origin:['http://46.101.115.253:8080'],
  methods:['GET', 'POST'],
  credentials: true,
}));
app.use('/public', express.static('./public/'));

const pgSession = connectPgSimple(session);
const pgPool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PW,
  max: 20,
});

app.use(session({
  store: new pgSession({
    pool: pgPool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
}));

// If no user exists, create root user
initUserCreationService();

// Basic authentication paths
app.use('/gen', genericAuth); // Signed into any account
app.use('/admin', adminAuth); // Signed into Admin account
app.use('/qa', qaAuth); // Signed into QA or Admin account
app.use('/modeller', modellerAuth); // Signed into Modeler, Admin, or QA account
app.use('/client', clientAuth); // Signed into client account

// General routes (no login required)
app.get('/', router);
app.get('/logout', router);
app.post('/login', router);

// Generic routes (requires being logged in)
app.get('/gen/login', router);
app.post('/gen/getproducts', router);
app.post('/gen/comment', router);
app.post('/gen/getComments', router);
app.post('/gen/getclientorders', router);
app.post('/gen/getmodels', router);

// Admin routes
app.get('/admin/getusers', router);
app.post('/admin/createUser', router);
app.post('/admin/edituser', router);
app.post('/admin/deleteuser', router);

// QA routes
app.get('/qa/getorders', router);
app.get('/qa/getmodelers', router);
app.get('/qa/getallmodels', router);
app.post('/qa/claimorder', router);
app.post('/qa/assignmodeler', router);
app.post('/qa/uploadios', router);
app.post('/qa/uploadandroid', router);

// Modeller routes
app.get('/modeller/models', router);
app.post('/modeller/listmodelfiles', router);
app.post('/modeller/uploadmodelfile', router);
app.post('/modeller/downloadmodelfile', router);

// Client routes
app.post('/client/createorder', router);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started on port ${port}`);
});
