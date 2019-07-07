import bcrypt from 'bcrypt';

import User from '../models/user';
import users from '../db/users';
import ResponseHelper from '../helpers/response_helper';

import {
  getSignUpError, getToken, isValidEmail,
  isValidPassword,
} from '../helpers/auth';


/**
 * Handles POST /api/v1/auth/signup requests
 */
export const signup = (request, response) => {
  const errorMessage = getSignUpError(request.body);
  if (errorMessage) {
    return ResponseHelper.getBadRequestErrorResponse(response, errorMessage);
  }

  const {
    email, firstName,
    lastName, phoneNumber,
    address, isAdmin, isAgent,
  } = request.body;

  if (users.find(user => user.email === email)) {
    return ResponseHelper.getConflictErrorResponse(response, 'Email address is taken');
  }

  bcrypt.hash(request.body.password, 10, (error, hash) => {
    if (error) {
      return ResponseHelper.getInternalServerError(response);
    }


    const lastUser = users[users.length - 1];
    const userId = lastUser ? lastUser.id + 1 : 1;
    users.push(new User(userId, email, firstName, lastName,
      hash, phoneNumber, address, isAdmin, isAgent));

    const user = users[users.length - 1];
    user.token = getToken(email, userId);

    return ResponseHelper.getSuccessResponse(response, {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      phoneNumber: user.phoneNumber,
      token: user.token,
      isAdmin,
      isAgent,
    }, 201);
  });
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
