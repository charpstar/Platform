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
import { adminAuth, clientAuth } from './middleware/auth';

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

app.use('/admin', adminAuth);
app.use('/client', clientAuth);

app.use('/', router);
app.use('/names', router);
app.post('/id', router);
app.post('/login', router);
app.post('/admin/createUser', router);
app.get('/logout', router);

export default app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started on port ${port}`);
});
