import ResponseHelper from '../helpers/response_helper';
/**
 * Handles errors with request body processing
 * @returns {response} if there was an error
 * Calls @function next if no error
 */
export default (error, request, response, next) => {
  if (error) console.log(error);
  next();
};
