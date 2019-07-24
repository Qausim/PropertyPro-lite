// Contains helper functions for authentication routes handlers
import jwt from 'jsonwebtoken';

import dbConnection from '../db/database';
import User from '../models/user';
import { isString, isNumber, hasNumber } from './property';


/**
 * Validates a given string argument is a valid email address.
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = email => /^(\D)+(\w)*((\.(\w)+)?)+@(\D)+(\w)*((\.(\D)+(\w)*)+)?(\.)[a-z]{2,}$/
  .test(email);

/**
 * Validates if a given given string argument is at least 6 characters long
 * @param {string} password
 * @returns {boolean}
 */
export const isValidPassword = password => password.length > 5;

/**
 * Validates if a given argument is an empty string
 * @param {string} field
 * @returns {boolean}
 */
export const isEmpty = field => field.length === 0;

/**
 * Validates if a given string argument is all digits and 11 characters long
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidPhoneNumber = phone => /^\d{11}$/.test(phone);


/**
 * Checks if a given string value contains special characters (i.e.
 *  any of +/*$^()[]{}\|~`&!@#%_=:;"'<>,.?) or invalid character-hyphen combination
 * for names.
 * @param {string} name
 * @returns {boolean}
 */
const hasInvalidSpecialCharacterCombination = name => /[+/*$^()[\]{}\\|~`&!@#%_=:;"'<>,.?]|(^-)|(-$)|(^-$)|(-{2,})/g.test(name);


/**
* Signs and returns an authentication token
* @param {string} email
* @param {number} userId
*
* @returns {string} token
*/
export const getToken = (email, userId) => jwt.sign({
  email, userId,
},
process.env.JWT_KEY);


/**
 * Validates an email address
 * Calls @function isEmpty, @function isString, @function isValidEmail
 *
 * @param {string} email
 * @returns {string | null} error
 */
const getEmailError = (email) => {
  let error = null;
  if (!email || isEmpty(email)) error = 'Email cannot be empty';
  else if (!isString(email)) error = 'Email should be a string value';
  else if (!isValidEmail(email)) error = 'Invalid email address';
  return error;
};


/**
 * Validates a password value
 * Calls @function isEmpty, @function isString, @function isValidPassword
 *
 * @param {string} password
 * @returns {string | null} error
 */
const getPasswordError = (password) => {
  let error = null;
  if (!password || isEmpty(password)) error = 'Password cannot be empty';
  else if (!isString(password)) error = 'Password should be a string value';
  else if (!isValidPassword(password)) error = 'Password should be at least six characters long';
  return error;
};


/**
 * Validates user's first and last names
 * Calls @function isEmpty, @function isString, @function hasNumber,
 * @function hasInvalidSpecialCharacterCombination
 *
 * @param {string} firstName
 * @param {string} lastName
 * @returns {string | null} error
 */
const getNameError = (firstName, lastName) => {
  let error = null;
  if (!firstName || isEmpty(firstName)) error = 'First name cannot be empty';
  else if (!isString(firstName)) error = 'First name should be a string value';
  else if (hasNumber(firstName)) error = 'First name should not contain a number';
  else if (hasInvalidSpecialCharacterCombination(firstName)) {
    error = 'Invalid special character combination in first name';
  } else if (!lastName || isEmpty(lastName)) error = 'Last name cannot be empty';
  else if (!isString(lastName)) error = 'Last name should be a string value';
  else if (hasNumber(lastName)) error = 'Last name should not contain a number';
  else if (hasInvalidSpecialCharacterCombination(lastName)) {
    error = 'Invalid special character combination in last name';
  }

  return error;
};


/**
 * Validates the address if in the required format and if supplied when required
 * Calls @function isEmpty, @function isString, @function isNumber
 *
 * @param {string} address
 * @param {boolean} isAgent
 * @returns {string | null} error
 */
const getAddressError = (address, isAgent) => {
  let error = null;
  if (isAgent && (!address || isEmpty(address))) error = 'Address is required for agents';
  else if (address && !isString(address)) error = 'Address should be a string value';
  else if (address && isNumber(address)) error = 'Address cannot be all numbers';

  return error;
};


/**
 * Validates the address if in the required format and if supplied when required
 * @function isEmpty, @function isString, @function isValidPhoneNumber
 *
 * @param {string} phone
 * @param {boolean} isAgent
 * @returns {string | null} error
 */
const getPhoneError = (phone, isAgent) => {
  let error = null;
  if (isAgent && (!phone || isEmpty(phone))) error = 'Phone number is required for agents';
  else if (phone && !isString(phone)) error = 'Phone number should be a string value';
  else if (phone && !isValidPhoneNumber(phone)) error = 'Invalid phone number';

  return error;
};


/**
 * Checks the request body properties for invalid values and returns
 * an appropriate error message.
 * Calls @function getEmailError, @function getPasswordError, @function getNameError,
 * @function getAddressError, @function getPhoneError
 *
 * @param {object} requestBody
 * @returns {string | undefined} errorMessage
 */
export const getSignUpError = ({
  email, password, first_name, last_name, address, is_agent, phone_number,
}) => {
  const errors = [
    getEmailError(email), getPasswordError(password), getNameError(first_name, last_name),
    getAddressError(address, is_agent), getPhoneError(phone_number, is_agent),
  ];
  const errorMessage = errors.find(el => el !== null);
  return errorMessage;
};


/**
 * Retrieves public user fields
 *
 * @param {User} user
 * @returns {object}
 */
const getPublicUserData = user => ({
  id: parseFloat(user.id),
  email: user.email,
  first_name: user.firstName,
  last_name: user.lastName,
  phone_number: user.phoneNumber,
  address: user.address,
  is_admin: user.isAdmin,
  is_agent: user.isAgent,
  token: user.token,
});


/**
 * Reformats database fields (with underscores) into camelCase
 * and returns them as such as fields of a new object
 * Calls @function getPublicUserData
 *
 * @param {object} data
 * @returns {object}
 */
export const reformatUserData = (data) => {
  const newData = {};
  Object.entries(data).forEach((entry) => {
    const splitKey = entry[0].split('_');
    const secondHalf = splitKey[1];
    const newKey = secondHalf ? `${splitKey[0]}${secondHalf[0]
      .toUpperCase()}${secondHalf.slice(1)}` : splitKey[0];
    // eslint-disable-next-line prefer-destructuring
    newData[newKey] = entry[1];
  });

  return getPublicUserData(newData);
};


/**
 * Creates a new user
 * Calls @function getToken, @function getPublicUserData
 *
 * @param {object} body
 * @param {string} hash
 * @param {string} usersTable *
 * @returns {user}
 */
export const createUser = async ({
  email, first_name, last_name, phone_number, address, is_agent,
}, hash, usersTable) => {
  // Get next database serial key
  const userIdQueryResult = await dbConnection.dbConnect(`SELECT nextval('${usersTable}_id_seq');`);

  if (userIdQueryResult.rowCount) {
    const userId = userIdQueryResult.rows[0].nextval;
    const user = new User(userId, email, first_name, last_name, hash, phone_number, address,
      is_agent);
    user.token = getToken(email, userId);
    const userInsertQueryResult = await dbConnection.dbConnect(`INSERT INTO ${usersTable} (
      id, email, first_name, last_name, password, phone_number, address, is_admin, is_agent)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`, [user.id, user.email, user.firstName,
      user.lastName, user.password, user.phoneNumber, user.address, user.isAdmin, user.isAgent]);

    if (userInsertQueryResult.rowCount) {
      const data = getPublicUserData(user);
      return data;
    } throw new Error();
  } else throw new Error();
};
