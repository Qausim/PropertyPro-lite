import { isNumber } from '../helpers/property';
import ResponseHelper from '../helpers/response_helper';


export default (request, response, next) => {
  if (!isNumber(request.params.propertyId)) {
    return ResponseHelper.getBadRequestErrorResponse(response,
      'Invalid property id');
  }
  next();
};
