// /property routes controller

import dotenv from 'dotenv';

import Property from '../models/property';
import properties from '../db/properties';
import users from '../db/users';
import ResponseHelper from '../helpers/response_helper';
import {
  getCreatePropertyError,
  getPropertyDetails,
  filterPropertiesByType,
  getUpdatePropertyError,
  hasForbiddenField,
} from '../helpers/property';

dotenv.config();

const propertyEditAccessError = 'Only an advert owner (agent) can edit it';

/**
 * Creates a new property advertisement and returns it or returns an
 * appropriate error message.
 * Calls @function getCreatePropertyError
 *
 * @param {*} request
 * @param {*} response
 *
 * @returns {responses}
 */
export const createProperty = (request, response) => {
  const errorMessage = getCreatePropertyError(request.body);
  if (errorMessage) {
    return ResponseHelper.getBadRequestErrorResponse(response, errorMessage);
  }
  const { userId } = request.userData;
  const user = users.find(el => el.id === userId);

  if (!user || !user.isAgent) {
    return ResponseHelper.getForbiddenErrorResponse(response,
      'Only agents can create property ads');
  }

  let imageUrl = '';
  if (request.file) {
    imageUrl = request.file.url;
  }

  const {
    type, state, city, address, price,
  } = request.body;

  const lastProperty = properties[properties.length - 1];
  const propertyId = lastProperty ? lastProperty.id + 1 : 1;

  properties.push(new Property(propertyId, userId, type, state, city,
    address, parseFloat(price), imageUrl));

  const property = properties.find(el => el.id === propertyId);

  return ResponseHelper.getSuccessResponse(response, property, 201);
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
    return filterPropertiesByType(response, properties, queryText);
  }

  const data = properties.map(getPropertyDetails);
  return ResponseHelper.getSuccessResponse(response, data);
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
  const propertyId = parseFloat(request.params.propertyId);

  const result = properties.find(property => property.id === propertyId);
  if (result) {
    const data = getPropertyDetails(result);
    return ResponseHelper.getSuccessResponse(response, data);
  }

  return ResponseHelper.getNotFoundErrorResponse(response);
};


/**
 * Marks a property advert as sold or return an error
 * @param {*} request
 * @param {*} response
 *
 * @returns {response}
 */
export const markPropertyAsSold = (request, response) => {
  const propertyId = parseFloat(request.params.propertyId);
  const { userId } = request.userData;
  const user = users.find(el => el.id === userId);
  const propertyIndex = properties.findIndex(property => property.id === propertyId);

  if (propertyIndex >= 0) {
    const property = properties[propertyIndex];
    if (property.owner === userId && user.isAgent) {
      property.status = 'sold';
      property.updatedOn = new Date();
      properties[propertyIndex] = property;

      return ResponseHelper.getSuccessResponse(response, property);
    }

    return ResponseHelper.getForbiddenErrorResponse(response, propertyEditAccessError);
  }

  return ResponseHelper.getNotFoundErrorResponse(response);
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
  const propertyId = parseFloat(request.params.propertyId);
  const user = users.find(el => el.id === request.userData.userId);
  const propertyIndex = properties.findIndex(el => el.id === propertyId);
  const property = properties[propertyIndex];

  if (!property) {
    return ResponseHelper.getNotFoundErrorResponse(response);
  }

  if (!user.isAgent || user.id !== property.owner) {
    return ResponseHelper.getForbiddenErrorResponse(response, propertyEditAccessError);
  }

  const errorMessage = getUpdatePropertyError(request.body);

  if (errorMessage) {
    return ResponseHelper.getBadRequestErrorResponse(response, errorMessage);
  }

  if (hasForbiddenField(request.body)) {
    return ResponseHelper.getForbiddenErrorResponse(response,
      'You cannot update fields "id" and "owner"');
  }

  Object.entries(request.body).forEach((entry) => {
    const [key, value] = entry;
    property[key] = key === 'price' ? parseFloat(value) : value;
  });

  property.updatedOn = new Date();
  properties[propertyIndex] = property;
  return ResponseHelper.getSuccessResponse(response, property);
};


/**
 * Deletes a property ad
 * @param {*} request
 * @param {*} response
 *
 * @returns {response}
 */
export const deleteProperty = (request, response) => {
  const propertyId = parseFloat(request.params.propertyId);
  const propertyIndex = properties.findIndex(el => el.id === propertyId);

  if (propertyIndex < 0) {
    return ResponseHelper.getNotFoundErrorResponse(response);
  }

  const property = properties[propertyIndex];
  const { userId } = request.userData;
  const user = users.find(el => el.id === userId);

  if (!user.isAgent || userId !== property.owner) {
    return ResponseHelper.getForbiddenErrorResponse(response,
      'Only an advert owner (agent) can delete it');
  }

  properties.splice(propertyIndex, 1);
  return ResponseHelper.getSuccessResponse(response, {
    message: 'Successfully deleted property ad',
  });
};
