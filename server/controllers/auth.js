import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

import users from '../db/users';
import User from '../models/user';

dotenv.config();

/**
 * Validates a given string argument is a valid email address.
 * @param {string} email
 */
const isValidEmail = (email) => {
  /^(\D)+(\w)*((\.(\w)+)?)+@(\D)+(\w)*((\.(\D)+(\w)*)+)?(\.)[a-z]{2,}$/
    .test(email);
};

/**
 * Validates if a given given string argument is at least 6 characters long
 * @param {string} password
 */
const isValidPassword = password => password.length > 5;

/**
 * Validates if a given argument is an empty string
 * @param {string} field
 */
const isEmpty = field => field.length === 0;

/**
 * Validates if a given string argument is all digits and 11 characters long
 * @param {string} phone
 */
const isValidPhoneNumber = phone => /^\d{11,}$/.test(phone);

/**
 * Checks the request body properties for invalid values and returns
 * an appropriate error message.
 * Calls @function isValidEmail, @function isValidPassword,
 * @function isEmpty, and @function isValidPhoneNumber
 */
const obtainSignUpError = ({
  email, password, firstName, lastName, address, isAgent, phoneNumber,
}) => {
  if (!isValidEmail(email)) {
    return 'Invalid email';
  }

  if (users.find(user => user.email === email)) {
    return 'Email address is taken';
  }

  if (!isValidPassword(password)) {
    return 'Invalid password';
  }

  if (!firstName || isEmpty(firstName)) {
    return 'First name is required';
  }

  if (!lastName || isEmpty(lastName)) {
    return 'Last name is required';
  }

  if ((!address || isEmpty(address)) && isAgent) {
    return 'Address is required for agents';
  }

  if (!isValidPhoneNumber(phoneNumber) && isAgent) {
    return 'Phone number is required for agents';
  }

  return false;
};

/**
 * Handles POST /api/v1/auth/signup requests
 */
export const signUp = (request, response) => {
  const errorMessage = obtainSignUpError(request.body);
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
      email,
      firstName,
      lastName,
      phoneNumber,
      address,
      isAdmin,
      isAgent,
    } = request.body;

    const lastUser = users[users.length - 1];
    const userId = lastUser ? lastUser.id + 1 : 1;
    users.push(new User(userId, email, firstName, lastName, hash, phoneNumber,
      address, isAdmin, isAgent));

    const user = users[users.length - 1];
    user.token = jwt.sign({
      email, userId,
    }, process.env.JWT_KEY);

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
