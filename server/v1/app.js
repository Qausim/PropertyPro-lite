import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import swaggerUI from 'swagger-ui-express';

import authRouter from './routes/auth';
import propertyRouter from './routes/property';
import Migration from './db/migration';
import ResponseHelper from './helpers/response_helper';
import swaggerDoc from '../swagger';

dotenv.config();
Migration.createTable();


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*'); // giving access to all
  response.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (request.method === 'OPTIONS') {
    response.header('Access-Control-Allow-Methods',
      'PUT, POST, PATCH, DELETE, GET');
    return response.status(200).json({});
  }
  next();
});

const basePath = '/api/v1';

// Swagger documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

// auth routes
app.use(`${basePath}/auth`, authRouter);
// property route
app.use(`${basePath}/property`, propertyRouter);


// Handle all requests to non-existing URLs
app.use((request, response) => ResponseHelper.getNotFoundErrorResponse(response));

export default app;
