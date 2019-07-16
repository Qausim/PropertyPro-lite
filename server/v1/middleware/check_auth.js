// Handles user authentication before having access to resources
import jwt from 'jsonwebtoken';

import ResponseHelper from '../helpers/response_helper';

/**
 * Decodes authentication token and proceeds with the request or returns
 * and error response.
 */
export default (request, response, next) => {
  try {
    const decoded = jwt.verify(request.headers.authorization.split(' ')[1],
      process.env.JWT_KEY);
    request.userData = decoded;
    next();
  } catch (error) {
    return ResponseHelper.getUnauthorizedErrorResponse(response);
  }
};
