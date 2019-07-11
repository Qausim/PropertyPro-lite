import Property from '../models/property';
import ResponseHelper from './response_helper';
import dbConnection from '../db/database';

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
  let errorMessage;
  if (!isString(type)) {
    errorMessage = 'Invalid type field';
  } else if (!state) {
    errorMessage = 'State is required';
  } else if (!isString(state) || hasNumber(state)) {
    errorMessage = 'Invalid state field';
  } else if (!city) {
    errorMessage = 'City is required';
  } else if (!isString(city) || hasNumber(city)) {
    errorMessage = 'Invalid city field';
  } else if (!address) {
    errorMessage = 'Address is required';
  } else if (!isString(address) || isNumber(address)) {
    errorMessage = 'Invalid address field';
  } else if (!parseFloat(price) || !isNumber(price)) {
    errorMessage = 'Invalid price field';
  }
  return errorMessage;
};


/**
 * Fetches the details of a property object as needed in GET
 * requests
 * @param {Property} property
 * @returns {object}
 */
export const getPropertyDetails = async (property, usersTable) => {
  const { rows: [ownerData] } = await dbConnection.dbConnect(`SELECT email, first_name, last_name, phone_number,
  address FROM ${usersTable} WHERE id = $1`, [property.owner]);
  return {
    id: property.id,
    status: property.status,
    type: property.type,
    state: property.state,
    city: property.city,
    address: property.address,
    price: property.price,
    createdOn: property.created_on,
    updatedOn: property.updated_on,
    imageUrl: property.image_url,
    ownerEmail: ownerData.email,
    ownerPhoneNumber: ownerData.phone_number,
    ownerName: `${ownerData.first_name} ${ownerData.last_name}`,
    ownerAddress: ownerData.address,
  };
};


/**
 * Filters the list of property by a given query text against property type
 * and returns an appropriate response or error message
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
    return ResponseHelper.getBadRequestErrorResponse(response, 'Empty query text');
  }

  const data = properties.filter(property => property.type
    .toLowerCase().includes(trimmedText)).map(getPropertyDetails);
  return ResponseHelper.getSuccessResponse(response, data);
};


/**
 * Checks through the body of a property update request for empty
 * required fields, and invalid fields
 * @param {object}
 *
 * @returns {string | boolean}
 */
export const getUpdatePropertyError = ({
  type, state, city, address, price,
}) => {
  let errorMessage;
  if (isString(type) && !type.trim()) {
    // there's an empty type field
    errorMessage = 'Type cannot be empty';
  } else if (isString(state) && !state.trim()) {
    // there's an empty state field
    errorMessage = 'State cannot be empty';
  } else if (state && (!isString(state) || hasNumber(state))) {
    // there's an invalid state field
    errorMessage = 'Invalid state field';
  } else if (isString(city) && !city.trim()) {
    // there's an empty city field
    errorMessage = 'City cannot be empty';
  } else if (city && (!isString(city) || hasNumber(city))) {
    // there's an invalid city field
    errorMessage = 'Invalid city field';
  } else if (isString(address) && !address.trim()) {
    // there's an empty address field
    errorMessage = 'Address cannot be empty';
  } else if (address && (!isString(address) || isNumber(address))) {
    // there's an invalid address field
    errorMessage = 'Invalid address field';
  } else if (price !== undefined && (
    price === '' || !isNumber(price) || parseFloat(price) <= 0)) {
    // price field is: '' | non-number | < 0
    errorMessage = 'Invalid price field';
  }
  return errorMessage;
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


/**
 * Inserts a new property item into the database
 * @param {object} request_body
 * @param {string} imageUrl
 * @param {number} userId
 * @param {string} propertiesTable
 *
 * @returns {Property} object
 */
export const dbInsertNewProperty = async ({
  type, state, city, address, price,
}, imageUrl, userId, propertiesTable) => {
  const propertyIdQueryRes = await dbConnection.dbConnect(`SELECT nextval('${propertiesTable}_id_seq');`);

  if (propertyIdQueryRes.rowCount) {
    const propertyId = propertyIdQueryRes.rows[0].nextval;
    const property = new Property(propertyId, userId, type, state, city, address, price, imageUrl);
    const propertyInsertRes = await dbConnection.dbConnect(`INSERT INTO ${propertiesTable}
    (id, type, state, city, address, price, created_on, updated_on, image_url, owner) VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, [propertyId, type, state, city, address, property.price,
      property.createdOn, property.updatedOn, property.imageUrl, property.owner]);

    if (propertyInsertRes.rowCount) {
      return property;
    } throw new Error();
  } else throw new Error();
};
