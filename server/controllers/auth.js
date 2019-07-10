import bcrypt from 'bcrypt';

import users from '../db/users';
import dbConnection from '../db/database';
import ResponseHelper from '../helpers/response_helper';
import {
  getSignUpError,
  getToken,
  isValidEmail,
  isValidPassword,
  createUser,
} from '../helpers/auth';
import '../config/tables_config';

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
  const signinErrorMessage = 'Invalid email or password';

  const { email, password } = request.body;

  if (!isValidEmail(email) || !isValidPassword(password)) {
    return ResponseHelper.getUnauthorizedErrorResponse(response, signinErrorMessage);
  }

  const user = users.find(el => el.email === email);
  if (!user) {
    return ResponseHelper.getUnauthorizedErrorResponse(response, signinErrorMessage);
  }

  bcrypt.compare(password, user.password, (error, result) => {
    if (result) {
      user.token = getToken(email, user.id);
      return ResponseHelper.getSuccessResponse(response, {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        phoneNumber: user.phoneNumber,
        token: user.token,
        isAdmin: user.isAdmin,
        isAgent: user.isAgent,
      });
    }

    return ResponseHelper.getUnauthorizedErrorResponse(response, signinErrorMessage);
  });
};
