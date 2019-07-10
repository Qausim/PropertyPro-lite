// Contains helper functions for authentication routes handlers
import jwt from 'jsonwebtoken';

import dbConnection from '../db/database';
import User from '../models/user';


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
  let errorMsg = '';
  if (!isValidEmail(email)) {
    errorMsg = 'Invalid email';
  } else if (!isValidPassword(password)) {
    errorMsg = 'Invalid password';
  } else if (!firstName || isEmpty(firstName)) {
    errorMsg = 'First name is required';
  } else if (!lastName || isEmpty(lastName)) {
    errorMsg = 'Last name is required';
  } else if ((!address || isEmpty(address)) && isAgent) {
    errorMsg = 'Address is required for agents';
  } else if (!isValidPhoneNumber(phoneNumber) && isAgent) {
    errorMsg = 'Phone number is required for agents';
  }

  return errorMsg;
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
  firstName: user.firstName,
  lastName: user.lastName,
  phoneNumber: user.phoneNumber,
  address: user.address,
  isAdmin: user.isAdmin,
  isAgent: user.isAgent,
  token: user.token,
});


/**
 * Reformats database fields (with underscores) into camelCase
 * and returns them as such as fields of a new object
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
 * @param {object} body
 * @param {string} hash
 * @param {string} usersTable
 *
 * @returns {user}
 */
export const createUser = async ({
  email, firstName, lastName, phoneNumber, address, isAdmin, isAgent,
}, hash, usersTable) => {
  let userId;
  const userIdQueryResult = await dbConnection.dbConnect(`SELECT nextval('${usersTable}_id_seq');`);

  if (userIdQueryResult.rowCount) {
    userId = parseFloat(userIdQueryResult.rows[0].nextval);
    const user = new User(userId, email, firstName, lastName, hash, phoneNumber || null,
      address || null, isAdmin, isAgent);
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
