import express from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';

import authRouter from './routes/auth';
import propertyRouter from './routes/property';


dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// auth routes
const baseApiRoute = '/api/v1';

app.use(`${baseApiRoute}/auth`, authRouter);

// property route
app.use(`${baseApiRoute}/property`, propertyRouter);


// Handle all requests to non-existing URLs
app.use((request, response) => {
  response.status(404).send({
    status: 'error',
    error: 'Not found',
  });
});

export default app;
