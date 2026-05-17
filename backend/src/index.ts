import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import apiRoutes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api', apiRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Ring health backend is running.' });
});

app.use(errorHandler);

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${port}`);
});
