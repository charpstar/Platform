import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import helmet from 'helmet';
import session from 'express-session';
import pg from 'pg';
import connectPgSimple from 'connect-pg-simple';
import port from './config/config';
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
app.use(cors());
app.use(express.static('./public/'));

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
app.use('/modellerAuth', modellerAuth); // Signed into Modeler, Admin, or QA account
app.use('/client', clientAuth); // Signed into client account

// General routes
app.get('/', router);
app.get('/logout', router);
app.post('/login', router);

// Generic routes
app.post('/gen/comment', router);

// Admin routes
app.get('/admin/getusers', router);
app.post('/admin/createUser', router);
app.post('/admin/edituser');
app.post('/admin/deleteuser', router);

// QA routes
app.get('/qa/getorders', router);
app.get('/qa/getmodelers', router);
app.post('/qa/getmodels', router);
app.post('/qa/claimorder', router);
app.post('/qa/assignmodeler', router);
app.post('/uploadModel', router);

// Modeler routes

// Client routes
app.post('/client/createorder', router);

export default app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started on port ${port}`);
});
