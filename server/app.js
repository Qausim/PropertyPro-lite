import express from 'express';
import bodyParser from 'body-parser';

import authRouter from './routes/auth';


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// auth routes
app.use('/api/v1/auth', authRouter);


// Handle all requests to non-existing URLs
app.use((request, response) => {
  response.status(404).send({
    status: 'error',
    error: 'Not found',
  });
});

export default app;
