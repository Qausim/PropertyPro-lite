import { isNumber } from '../helpers/property';


export default (request, response, next) => {
  if (!isNumber(request.params.propertyId)) {
    return response.status(400).json({
      status: 'error',
      error: 'Invalid property id',
    });
  }

  next();
};
