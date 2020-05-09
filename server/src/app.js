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
import { initUserCreationService } from './services/userService';

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
  origin: true,
  methods: ['GET', 'POST'],
  credentials: true,
}));
app.use('/public', express.static('./public/'));
app.use('/public', (req, res) => {
  const data = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  const img = Buffer.from(data, 'base64');
  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': img.length,
  });
  res.end(img);
});

const PgSession = connectPgSimple(session);
const pgPool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PW,
  max: 20,
});

app.use(session({
  store: new PgSession({
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
app.use(router);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started on port ${port}`);
});
