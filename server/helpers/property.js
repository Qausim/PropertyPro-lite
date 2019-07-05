import users from '../db/users';

/**
 * Validates that its value argument is of string type
 * @param {*} value
 *
 * @returns {boolean}
 */
const isString = value => typeof value === 'string';


/**
 * Validates that its value argument is of type number or a
 * string of numbers
 * @param {*} value
 *
 * @returns {boolean}
 */
export const isNumber = value => typeof value === 'number'
  || /^\d+(\.\d+)?$/.test(value);


/**
 * Validates that a passed string value contains number in it
 * @param {string} value
 *
 * @returns {boolean}
 */
const hasNumber = value => /\d/.test(value);


/**
 * Passes the fields in a request body validating each and returning
 * an appropriate error message or false
 * Calls @function isString, @function isNumber, @function hasNumber
 *
 * @param {object}
 *
 * @returns {string | boolean}
 */
export const getCreatePropertyError = ({
  type, state, city, address, price,
}) => {
  if (!isString(type)) {
    return 'Invalid type field';
  } if (!state) {
    return 'State is required';
  } if (!isString(state) || hasNumber(state)) {
    return 'Invalid state field';
  } if (!city) {
    return 'City is required';
  } if (!isString(city) || hasNumber(city)) {
    return 'Invalid city field';
  } if (!address) {
    return 'Address is required';
  } if (!isString(address) || isNumber(address)) {
    return 'Invalid address field';
  } if (!parseFloat(price) || !isNumber(price)) {
    return 'Invalid price field';
  }
  return false;
};


/**
 * Fetches the details of a property object as needed in GET
 * requests
 * @param {Property} property
 * @returns {object}
 */
export const getPropertyDetails = (property) => {
  const {
    email, firstName, lastName, phoneNumber,
  } = users.find(user => user.id === property.owner);

  return {
    id: property.id,
    status: property.status,
    type: property.type,
    state: property.state,
    city: property.city,
    address: property.address,
    price: property.price,
    createdOn: property.createdOn,
    updatedOn: property.updatedOn,
    imageUrl: property.imageUrl,
    ownerEmail: email,
    ownerPhoneNumber: phoneNumber,
    ownerName: `${firstName} ${lastName}`,
  };
};


/**
 * Filters the list of property by a given query text and returns an
 * appropriate response or error message
 *
 * @param {*} response
 * @param {Array} properties
 * @param {string} queryText
 *
 * @returns {response}
 */
export const filterPropertiesByType = (response, properties, queryText) => {
  const trimmedText = queryText.trim().toLowerCase();
  if (!trimmedText) {
    return response.status(400).json({
      status: 'error',
      error: 'Empty query text',
    });
  }

  const data = properties.filter(property => property.type
    .toLowerCase().includes(trimmedText)).map(getPropertyDetails);
  return response.status(200).json({
    status: 'success',
    data,
  });
};


/**
 * Checks through the body of a property update request for empty
 * required fields, and invalid fields
 *
 * @param {object}
 *
 * @returns {string | boolean}
 */
export const getUpdatePropertyError = ({
  type, state, city, address, price,
}) => {
  if (isString(type) && !type.trim()) {
    // there's an empty type field
    return 'Type cannot be empty';
  } if (isString(state) && !state.trim()) {
    // there's an empty state field
    return 'State cannot be empty';
  } if (state && (!isString(state) || hasNumber(state))) {
    // there's an invalid state field
    return 'Invalid state field';
  } if (isString(city) && !city.trim()) {
    // there's an empty city field
    return 'City cannot be empty';
  } if (city && (!isString(city) || hasNumber(city))) {
    // there's an invalid city field
    return 'Invalid city field';
  } if (isString(address) && !address.trim()) {
    // there's an empty address field
    return 'Address cannot be empty';
  } if (address && (!isString(address) || isNumber(address))) {
    // there's an invalid address field
    return 'Invalid address field';
  } if (price !== undefined && (
    price === '' || !isNumber(price) || parseFloat(price) <= 0)) {
    // price field is: '' | non-number | < 0
    return 'Invalid price field';
  }
  return false;
};


/**
 * Checks the body of a property update request if it contains an "id"
 * or/and an "owner" field
 * @param {object} body
 *
 * @returns {boolean}
 */
export const hasForbiddenField = (body) => {
  const keys = Object.keys(body);
  return keys.includes('id') || keys.includes('owner');
};
