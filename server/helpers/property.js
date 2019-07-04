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
 * @param {object} param
 */
export const getPostPropertyError = ({
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
