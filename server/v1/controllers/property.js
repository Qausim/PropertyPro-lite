// /property routes controller
import dbConnection from '../db/database';
import '../config/db_tables_config';
import ResponseHelper from '../helpers/response_helper';
import {
  getCreatePropertyError,
  getFullPropertyDetails,
  filterPropertiesByType,
  getUpdatePropertyError,
  hasForbiddenField,
  dbInsertNewProperty,
  dbMarkPropertyAsSold,
  dbGetPropertyOwnerAndRequesterPermissionLevel,
  dbUpdateProperty,
  dbDeleteProperty,
} from '../helpers/property';


const propertyEditAccessError = 'Only an advert owner (agent) can edit it';
const usersTable = process.env.USERS_TABLE;
const propertiesTable = process.env.PROPERTIES_TABLE;


/**
 * Creates a new property advertisement and returns it or returns an
 * appropriate error message.
 * Calls @function getCreatePropertyError, @function dbInsertNewProperty
 *
 * @param {*} request
 * @param {*} response
 *
 * @returns {response}
 */
export const createProperty = (request, response) => {
  const errorMessage = getCreatePropertyError(request.body);
  if (errorMessage) {
    return ResponseHelper.getBadRequestErrorResponse(response, errorMessage);
  }
  const { userId } = request.userData;
  dbConnection.dbConnect(`SELECT is_agent FROM ${usersTable} WHERE id = $1`, [userId])
    .then((selectRes) => {
      if (!selectRes.rowCount) {
        return ResponseHelper.getForbiddenErrorResponse(response,
          'Only agents can create property ads');
      }

      let imageUrl = '';
      if (request.file) {
        imageUrl = request.file.url;
      }
      dbInsertNewProperty(request.body, imageUrl, userId, propertiesTable)
        .then(property => ResponseHelper.getSuccessResponse(response, property, 201))
        .catch(() => ResponseHelper.getInternalServerError(response));
    })
    .catch(() => ResponseHelper.getInternalServerError(response));
};

/**
 * Handles get requests to fetch all property ads or by search.
 * Calls @function filterPropertiesByType, @function getPropertyDetails
 *
 * @param {*} request
 * @param {*} response
 *
 * @returns {response}
 */
export const getProperties = (request, response) => {
  const queryText = request.query.type;

  // Handle search queries by type
  if (queryText !== undefined) {
    return filterPropertiesByType(response, queryText, propertiesTable, usersTable)
      .then(res => res)
      .catch(() => ResponseHelper.getInternalServerError(response));
  }
  dbConnection.dbConnect(`SELECT * FROM ${propertiesTable};`)
    .then(res => res.rows.map(ad => getFullPropertyDetails(ad, usersTable)))
    .then(res => Promise.all(res))
    .then(data => ResponseHelper.getSuccessResponse(response, data))
    .catch(() => ResponseHelper.getInternalServerError());
};


/**
 * Fetches a specific property advert by it id obtained from the request URL
 * Calls @function getPropertyDetails
 *
 * @param {*} request
 * @param {*} response
 *
 * @returns {response}
 */
export const getPropertyById = (request, response) => {
  const { propertyId } = request.params;
  dbConnection.dbConnect(`SELECT * FROM ${propertiesTable} WHERE id = $1;`, [propertyId])
    .then((res) => {
      if (res.rowCount) {
        return getFullPropertyDetails(res.rows[0], usersTable)
          .then(data => (() => ResponseHelper.getSuccessResponse(response, data)));
      }
      return (() => ResponseHelper.getNotFoundErrorResponse(response));
    })
    .then(res => res())
    .catch(() => ResponseHelper.getNotFoundErrorResponse(response));
};


/**
 * Marks a property advert as sold or return an error
 * @param {*} request
 * @param {*} response
 *
 * @returns {response}
 */
export const markPropertyAsSold = (request, response) => {
  const { propertyId } = request.params;
  const { userId } = request.userData;
  dbGetPropertyOwnerAndRequesterPermissionLevel(userId, propertyId, usersTable, propertiesTable)
    .then(({ error, propertyOwner }) => {
      if (error) return (() => ResponseHelper.getNotFoundErrorResponse(response));

      if (propertyOwner === userId) {
        return dbMarkPropertyAsSold(response, propertiesTable, propertyId, usersTable);
      }
      return (() => ResponseHelper.getForbiddenErrorResponse(response, propertyEditAccessError));
    })
    .then(res => res())
    .catch(() => ResponseHelper.getInternalServerError(response));
};


/**
 * Updates a property ad with new details save its id and the of its owner's
 * Calls @function getUpdatePropertyError, @function hasForbiddenField
 *
 * @param {*} request
 * @param {*} response
 *
 * @returns {response}
 */
export const updateProperty = (request, response) => {
  const errorMessage = getUpdatePropertyError(request.body);
  if (errorMessage) return ResponseHelper.getBadRequestErrorResponse(response, errorMessage);
  if (hasForbiddenField(request.body)) {
    return ResponseHelper.getForbiddenErrorResponse(response,
      'You cannot update fields "id" and "owner"');
  }

  const { params: { propertyId }, userData: { userId } } = request;
  console.log(JSON.stringify(request.body, null, 4));
  console.log(JSON.stringify(request.userData, null, 4), userId);
  // Nested database (promise calls) each resolving to the inner till a response is obtainable
  dbGetPropertyOwnerAndRequesterPermissionLevel(userId, propertyId, usersTable,
    propertiesTable)
    .then(({ error, propertyOwner }) => {
      if (error) return (() => ResponseHelper.getNotFoundErrorResponse(response));
      if (propertyOwner === userId) {
        return dbUpdateProperty(response, request.body, propertiesTable, propertyId,
          usersTable);
      }
      return (() => ResponseHelper.getForbiddenErrorResponse(response,
        propertyEditAccessError));
    })
    .then(res => res())
    .catch(() => ResponseHelper.getInternalServerError(response));
};


/**
 * Deletes a property ad, first validates the property ad exists, then that the
 * user has permission to delete before proceeding with deletion
 * Calls @function dbGetPropertyOwnerAndRequesterAgentStatus, and
 * @function dbDeleteProperty
 *
 * @param {*} request
 * @param {*} response
 */
export const deleteProperty = (request, response) => {
  const { params: { propertyId }, userData: { userId } } = request;
  dbGetPropertyOwnerAndRequesterPermissionLevel(userId, propertyId, usersTable, propertiesTable)
    .then(({ error, propertyOwner }) => {
      if (error) return (() => ResponseHelper.getNotFoundErrorResponse(response));
      if (propertyOwner === userId) {
        return dbDeleteProperty(response, propertyId, propertiesTable);
      }
      return (() => ResponseHelper.getForbiddenErrorResponse(response,
        'Only an advert owner (agent) can delete it'));
    })
    .then(res => res())
    .catch(() => ResponseHelper.getInternalServerError(response));
};
