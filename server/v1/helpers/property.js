import Property from '../models/property';
import ResponseHelper from './response_helper';
import dbConnection from '../db/database';

const propertyEditableFields = ['price', 'type', 'state', 'city', 'address'];

/**
 * Validates that its value argument is of string type
 * @param {*} value
 *
 * @returns {boolean}
 */
export const isString = value => typeof value === 'string';


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
export const hasNumber = value => /\d/.test(value);


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
  if (!type) errorMessage = 'Type field is required';
  else if (!isString(type)) errorMessage = 'Type field must be a string';
  else if (!type.trim()) errorMessage = 'Type field is required';
  else if (isNumber(type)) errorMessage = 'Type field cannot be all number';
  else if (!state) errorMessage = 'State field is required';
  else if (!isString(state) || !state.trim() || hasNumber(state)) {
    errorMessage = 'State field must be a non-empty string and must not contain a number';
  } else if (!city) errorMessage = 'City field is required';
  else if (!isString(city) || !city.trim() || hasNumber(city)) {
    errorMessage = 'City field must be a non-empty string and must not contain a number';
  } else if (!address) errorMessage = 'Address field is required';
  else if (!isString(address) || !address.trim() || isNumber(address)) {
    errorMessage = 'Address field must be a non-empty string and must not be all number';
  } else if (!price || !isNumber(price) || !parseFloat(price)) {
    errorMessage = 'Price field is required and must be a number above zero';
  }

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
 * @returns {response}
 */
export const filterPropertiesByType = async (response, queryText, propertiesTable, usersTable) => {
  const trimmedText = queryText.trim();
  if (!trimmedText) {
    return (() => ResponseHelper.getBadRequestErrorResponse(response, 'Empty query text'));
  }

  const { rows } = await dbConnection.dbConnect(`SELECT * FROM ${propertiesTable} WHERE type
  ilike '%${trimmedText}%';`);
  const promisedProperties = rows.map(property => getFullPropertyDetails(property, usersTable));
  const data = await Promise.all(promisedProperties);
  return (() => ResponseHelper.getSuccessResponse(response, data));
};


/**
 * Checks through the body of a property update request for empty
 * required fields, and invalid fields.
 * Calls @function isString, @function isNumber, @function hasNumber
 *
 * @param {object}
 * @returns {string | undefined}
 */
export const getUpdatePropertyError = (body) => {
  let errorMessage;
  const {
    type, state, city, address, price,
  } = body;
  if (hasForbiddenField(body)) errorMessage = 'You cannot update property fields "id" and "owner"';
  else if (type !== undefined) {
    if (!isString(type)) errorMessage = 'Type field must be a string value';
    else if (!type.trim()) errorMessage = 'Type field cannot be updated with an empty value';
    else if (isNumber(type)) errorMessage = 'Type field cannot be all number';
  } else if (state !== undefined) {
    if (!isString(state)) errorMessage = 'State field must be a string value';
    else if (!state.trim()) errorMessage = 'State field cannot be updated with an empty value';
    else if (hasNumber(state)) errorMessage = 'State field cannot contain a number';
  } else if (city !== undefined) {
    if (!isString(city)) errorMessage = 'City field must be a string value';
    else if (!city.trim()) errorMessage = 'City field cannot be updated with an empty value';
    else if (hasNumber(city)) errorMessage = 'City field cannot contain a number';
  } else if (address !== undefined) {
    if (!isString(address)) errorMessage = 'Address field must be a string value';
    else if (!address.trim()) errorMessage = 'Address field cannot be updated with an empty value';
    else if (isNumber(address)) errorMessage = 'Address field cannot be all number';
  } else if (price !== undefined && (!isNumber(price) || parseFloat(price) <= 0)) {
    errorMessage = 'Price field must be a non-zero positive number';
  }
  return errorMessage;
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
  const permissionQueryRes = await dbConnection.dbConnect(`SELECT is_admin FROM ${usersTable}
    WHERE id = $1;`, [userId]);
  const ownerqueryRes = await dbConnection.dbConnect(`SELECT owner FROM ${propertiesTable}
    WHERE id = $1;`, [propertyId]);
  if (!ownerqueryRes.rowCount) return { error: true };
  return {
    propertyOwner: ownerqueryRes.rows[0].owner,
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
  const entries = Object.entries(body).filter(el => propertyEditableFields.includes(el[0]));
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


/**
 * Deletes a property record from the database
 *
 * @param {*} response
 * @param {number} propertyId
 * @param {string} propertiesTable
 * @returns {Promise} a function that can be invoked
 */
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
