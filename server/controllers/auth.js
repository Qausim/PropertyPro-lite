import bcrypt from 'bcrypt';

import dbConnection from '../db/database';
import ResponseHelper from '../helpers/response_helper';
import {
  getSignUpError,
  getToken,
  isValidEmail,
  isValidPassword,
  createUser,
  reformatUserData,
} from '../helpers/auth';
import '../config/db_tables_config';

const usersTable = process.env.USERS_TABLE;

/**
 * Handles POST /api/v1/auth/signup requests
 * Calls @function getSignUpError, @function createUser
 *
 * @param {*} request
 * @param {*} response
 */
export const signup = (request, response) => {
  const errorMessage = getSignUpError(request.body);
  if (errorMessage) {
    return ResponseHelper.getBadRequestErrorResponse(response, errorMessage);
  }

  dbConnection.dbConnect(`SELECT FROM ${usersTable} WHERE email = $1`, [request.body.email])
    .then((existsResult) => {
      if (existsResult.rowCount) {
        return ResponseHelper.getConflictErrorResponse(response, 'Email address is taken');
      }

      bcrypt.hash(request.body.password, 10, (error, hash) => {
        if (error) return ResponseHelper.getInternalServerError(response);

        createUser(request.body, hash, usersTable)
          .then(user => ResponseHelper.getSuccessResponse(response, user, 201))
          .catch(() => ResponseHelper.getInternalServerError(response));
      });
    })
    .catch(() => ResponseHelper.getInternalServerError(response));
};


/**
 * Handles singin request and returns a user object if successful
 * else an error message. Error message is kept consistent so
 * behaviour cannot be guessed.
 *
 * @param request
 * @param response
 */
export const signin = (request, response) => {
  console.log(JSON.stringify(request.body, null, 4));
  const signinErrorMessage = 'Invalid email or password';
  const { email, password } = request.body;

  if (!isValidEmail(email) || !isValidPassword(password)) {
    return ResponseHelper.getUnauthorizedErrorResponse(response, signinErrorMessage);
  }

  dbConnection.dbConnect(`SELECT * FROM ${usersTable} WHERE email = $1`, [email])
    .then((res) => {
      if (!res.rowCount) {
        return ResponseHelper.getUnauthorizedErrorResponse(response, signinErrorMessage);
      }

      const user = res.rows[0];
      bcrypt.compare(password, user.password, (error, authRes) => {
        if (authRes) {
          user.token = getToken(email, user.id);
          return ResponseHelper.getSuccessResponse(response, reformatUserData(user));
        }
        return ResponseHelper.getUnauthorizedErrorResponse(response, signinErrorMessage);
      });
    })
    .catch(() => ResponseHelper.getInternalServerError(response));
};
