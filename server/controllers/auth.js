import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

import User from '../models/user';
import users from '../db/users';

import {
  getSignUpError, getToken, isValidEmail,
  isValidPassword,
} from '../helpers/auth';


dotenv.config();


/**
 * Handles POST /api/v1/auth/signup requests
 */
export const signup = (request, response) => {
  const errorMessage = getSignUpError(request.body);
  if (errorMessage) {
    return response.status(400).json({
      status: 'error',
      error: errorMessage,
    });
  }

  bcrypt.hash(request.body.password, 10, (error, hash) => {
    if (error) {
      return response.status(500).json({
        status: 'error',
        error: 'Internal server error',
      });
    }

    const {
      email, firstName,
      lastName, phoneNumber,
      address, isAdmin, isAgent,
    } = request.body;

    const lastUser = users[users.length - 1];
    const userId = lastUser ? lastUser.id + 1 : 1;
    users.push(new User(userId, email, firstName, lastName,
      hash, phoneNumber, address, isAdmin, isAgent));

    const user = users[users.length - 1];
    user.token = getToken(email, userId);

    return response.status(201).json({
      status: 'success',
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        phoneNumber: user.phoneNumber,
        token: user.token,
        isAdmin,
        isAgent,
      },
    });
  });
};


/**
 * Handles login request and returns a user object if successful
 * else an error message. Error message is kept consistent so
 * behaviour cannot be guessed.
 *
 * @param request
 * @param response
 */
export const login = (request, response) => {
  const loginError = {
    status: 'error',
    error: 'Invalid email or password',
  };

  const { email, password } = request.body;

  if (!isValidEmail(email) || !isValidPassword(password)) {
    return response.status(401).json(loginError);
  }

  const user = users.find(el => el.email === email);
  if (!user) {
    return response.status(401).json(loginError);
  }

  bcrypt.compare(password, user.password, (error, result) => {
    if (result) {
      user.token = getToken(email, user.id);
      return response.status(200).json({
        status: 'success',
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          address: user.address,
          phoneNumber: user.phoneNumber,
          token: user.token,
          isAdmin: user.isAdmin,
          isAgent: user.isAgent,
        },
      });
    }

    return response.status(401).json(loginError);
  });
};
