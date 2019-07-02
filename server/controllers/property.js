import dotenv from 'dotenv';

import Property from '../models/property';
import properties from '../db/properties';
import users from '../db/users';
import { getPostPropertyError } from '../helpers/property';

dotenv.config();


/**
 * Creates a new property advertisement and returns it or returns an
 * appropriate error message.
 * Calls @function getPostPropertyError
 *
 * @param {*} request
 * @param {*} response
 */
export const createProperty = (request, response) => {
  const errorMessage = getPostPropertyError(request.body);
  if (errorMessage) {
    return response.status(400).json({
      status: 'error',
      error: errorMessage,
    });
  }
  const { userId } = request.userData;
  const user = users.find(el => el.id === userId);

  if (!user || !user.isAgent) {
    return response.status(403).json({
      status: 'error',
      error: 'Only agents can create property ads',
    });
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

  return response.status(201).json({
    status: 'success',
    data: property,
  });
};

export const getProperties = (request, response) => {
  const responseData = properties.map((property) => {
    const {
      email, phoneNumber, firstName, lastName,
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
  });

  response.status(200).json({
    status: 'success',
    data: responseData,
  });
};
