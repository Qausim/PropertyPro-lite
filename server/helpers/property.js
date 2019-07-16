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
 * @param {object} body
 *
 * @returns {string | undefined}
 */
export const getCreatePropertyError = ({
  type, state, city, address, price,
}) => {
  let errorMessage;
  if (!isString(type)) errorMessage = 'Invalid type field';
  else if (!state) errorMessage = 'State is required';
  else if (!isString(state) || hasNumber(state)) errorMessage = 'Invalid state field';
  else if (!city) errorMessage = 'City is required';
  else if (!isString(city) || hasNumber(city)) errorMessage = 'Invalid city field';
  else if (!address) errorMessage = 'Address is required';
  else if (!isString(address) || isNumber(address)) errorMessage = 'Invalid address field';
  else if (!parseFloat(price) || !isNumber(price)) errorMessage = 'Invalid, zero or empty price field';

  return errorMessage;
};


/**
 * Fetches the details of a property object as needed in GET
 * requests
 * @param {Property} property
 * @returns {object}
 */
export const getFullPropertyDetails = async (property, usersTable) => {
  const { rows: [ownerData] } = await dbConnection.dbConnect(`SELECT email, first_name,
  last_name, phone_number, address FROM ${usersTable} WHERE id = $1`, [property.owner]);
  return {
    id: parseFloat(property.id),
    status: property.status,
    type: property.type,
    state: property.state,
    city: property.city,
    address: property.address,
    price: parseFloat(property.price),
    created_on: property.created_on,
    updated_on: property.updated_on,
    image_url: property.image_url,
    owner_email: ownerData.email,
    owner_phone_number: ownerData.phone_number,
    owner_name: `${ownerData.first_name} ${ownerData.last_name}`,
    owner_address: ownerData.address,
  };
};


/**
 * Retrieves the details of a property ad without extending to
 * agent details
 * @param {Property} property
 * @returns {object}
 */
export const getOnlyPropertyDetails = property => ({
  id: parseFloat(property.id),
  status: property.status,
  type: property.type,
  state: property.state,
  city: property.city,
  address: property.address,
  price: parseFloat(property.price),
  created_on: property.created_on || property.createdOn,
  updated_on: property.updated_on || property.updatedOn,
  image_url: property.image_url || property.imageUrl,
});


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
export const filterPropertiesByType = async (response, queryText, propertiesTable, usersTable) => {
  const trimmedText = queryText.trim();
  if (!trimmedText) {
    return ResponseHelper.getBadRequestErrorResponse(response, 'Empty query text');
  }

  const { rows } = await dbConnection.dbConnect(`SELECT * FROM ${propertiesTable} WHERE type
  ilike '%${trimmedText}%';`);
  const promisedProperties = rows.map(property => getFullPropertyDetails(property, usersTable));
  const data = await Promise.all(promisedProperties);
  return ResponseHelper.getSuccessResponse(response, data);
};


/**
 * Checks through the body of a property update request for empty
 * required fields, and invalid fields
 * @param {object}
 *
 * @returns {string | undefined}
 */
export const getUpdatePropertyError = ({
  type, state, city, address, price,
}) => {
  let errorMessage;
  // if there's an empty type field
  if (isString(type) && !type.trim()) errorMessage = 'Type cannot be empty';
  // there's an empty state field
  else if (isString(state) && !state.trim()) errorMessage = 'State cannot be empty';
  // if there's an invalid state field
  else if (state && (!isString(state) || hasNumber(state))) errorMessage = 'Invalid state field';
  // there's an empty city field
  else if (isString(city) && !city.trim()) errorMessage = 'City cannot be empty';
  // there's an invalid city field
  else if (city && (!isString(city) || hasNumber(city))) errorMessage = 'Invalid city field';
  // there's an empty address field
  else if (isString(address) && !address.trim()) errorMessage = 'Address cannot be empty';
  // there's an invalid address field
  else if (address && (!isString(address) || isNumber(address))) errorMessage = 'Invalid address field';
  // price field is: '' | non-number | <= 0
  else if (price !== undefined && (
    price === '' || !isNumber(price) || parseFloat(price) <= 0)) errorMessage = 'Invalid, zero or empty price field';

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
      return getOnlyPropertyDetails(property);
    } throw new Error();
  } else throw new Error();
};


/**
 * @async function that retrieves the owner details of a property ad and requesting
 * user type to help validate the permission level of the user to operate on the advert
 *
 * @param {number} userId Id of user requesting to operate on property ad
 * @param {number} propertyId Id of property to be operated on
 * @param {string} usersTable Users table name
 * @param {string} propertiesTable Properties table name
 *
 * @returns {object} with attributes 'error' || isAgent && propertyOwner
 */
export const dbGetPropertyOwnerAndRequesterPermissionLevel = async (userId, propertyId, usersTable,
  propertiesTable) => {
  const permissionQueryRes = await dbConnection.dbConnect(`SELECT is_agent, is_admin FROM ${usersTable}
    WHERE id = $1;`, [userId]);
  const ownerqueryRes = await dbConnection.dbConnect(`SELECT owner FROM ${propertiesTable}
    WHERE id = $1;`, [propertyId]);
  if (!ownerqueryRes.rowCount) return { error: true };
  return {
    propertyOwner: ownerqueryRes.rows[0].owner,
    isAgent: permissionQueryRes.rows[0].is_agent,
    isAdmin: permissionQueryRes.rows[0].is_admin,
  };
};


/**
 * Updates database property record's status
 * @param {*} response
 * @param {string} propertiesTable
 * @param {number string} propertyId
 * @param {string} usersTable
 *
 * @returns {Promise} a function that can be invoked when resolved
 */
export const dbMarkPropertyAsSold = async (response, propertiesTable,
  propertyId, usersTable) => {
  const updateTime = new Date().toLocaleString();
  const updateRes = await dbConnection.dbConnect(`UPDATE ${propertiesTable} SET status='sold',
  updated_on= $1 WHERE id = $2`, [updateTime, propertyId]);
  if (updateRes.rowCount) {
    return dbConnection.dbConnect(`SELECT * FROM ${propertiesTable} WHERE id = $1;`,
      [propertyId])
      .then(selectRes => getFullPropertyDetails(selectRes.rows[0], usersTable)
        .then(data => () => ResponseHelper.getSuccessResponse(response, data)));
  }
  return (() => { throw new Error(); });
};


/**
 * Updates a property ad with new details
 * @param {*} response object
 * @param {object} body request body
 * @param {string} propertiesTable properties table name
 * @param {number} propertyId id of property to be updated
 * @param {string} usersTable users table name
 *
 * @returns {Promise} a function that can be invoked when resolved
 */
export const dbUpdateProperty = async (response, body, propertiesTable,
  propertyId, usersTable) => {
  // Obtain supplied request fields to create a database query string and datasets
  const entries = Object.entries(body);
  let queryString = '';
  const querySet = [];
  entries.forEach((el, ind) => {
    queryString += `${el[0]}=$${ind + 1},`;
    querySet.push(el[1]);
  });
  // Add update time to db query, query db and return updated data or an error
  querySet.push(new Date().toLocaleString());
  queryString += `updated_on=$${querySet.length}`;
  querySet.push(propertyId);
  queryString = `UPDATE ${propertiesTable} SET ${queryString} WHERE id = $${querySet.length};`;
  return dbConnection.dbConnect(queryString, querySet)
    .then((res) => {
      if (res.rowCount) {
        return dbConnection.dbConnect(`SELECT * FROM ${propertiesTable} WHERE id = $1;`, [propertyId])
          .then(selectRes => getFullPropertyDetails(selectRes.rows[0], usersTable))
          .then(data => () => ResponseHelper.getSuccessResponse(response, data));
      }
      return (() => { throw new Error(); });
    });
};


export const dbDeleteProperty = async (response, propertyId, propertiesTable) => dbConnection
  .dbConnect(`DELETE FROM ${propertiesTable} WHERE id = $1;`, [propertyId])
  .then((res) => {
    if (res.rowCount) {
      return (() => ResponseHelper.getSuccessResponse(response, {
        message: 'Successfully deleted property ad',
      }));
    }
    return (() => { throw new Error(); });
  });
