import jwt from 'jsonwebtoken';

import users from '../db/users';


/**
 * Validates a given string argument is a valid email address.
 * @param {string} email
 */
export const isValidEmail = email => /^(\D)+(\w)*((\.(\w)+)?)+@(\D)+(\w)*((\.(\D)+(\w)*)+)?(\.)[a-z]{2,}$/
  .test(email);

/**
 * Validates if a given given string argument is at least 6 characters long
 * @param {string} password
 */
export const isValidPassword = password => password.length > 5;

/**
 * Validates if a given argument is an empty string
 * @param {string} field
 */
export const isEmpty = field => field.length === 0;

/**
 * Validates if a given string argument is all digits and 11 characters long
 * @param {string} phone
 */
export const isValidPhoneNumber = phone => /^\d{11,}$/.test(phone);

/**
* Signs and returns an authentication token
* @param {string} email
* @param {number} userId
*/
export const getToken = (email, userId) => jwt.sign({
  email, userId,
},
process.env.JWT_KEY);


/**
 * Checks the request body properties for invalid values and returns
 * an appropriate error message.
 * Calls @function isValidEmail, @function isValidPassword,
 * @function isEmpty, and @function isValidPhoneNumber
 */
export const getSignUpError = ({
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
