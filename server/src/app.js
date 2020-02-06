import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import helmet from 'helmet';
import session from 'express-session';
import port from './config/config';
import router from './routes/router';

const envFetch = dotenv.config();

if (envFetch.error) {
  throw envFetch.error;
}

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(morgan('combined'));
app.use(helmet());
app.use(cors());
app.use(session({ secret: process.env.SESSION_SECRET }));

app.use('/', router);
app.use('/names', router);
app.post('/id', router);

export default app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started on port ${port}`);
});
