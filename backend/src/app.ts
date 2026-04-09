import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import routes from './routes';
import { apiLimiter } from './middlewares/rateLimiter';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(apiLimiter);

app.use('/api', routes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

export default app;