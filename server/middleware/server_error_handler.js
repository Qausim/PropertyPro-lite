/**
 * Handles errors with request body processing
 * @returns {response} if there was an error
 * Calls @function next if no error
 */
export default (error, request, response, next) => {
  if (error) {
    return response.status(500).json({
      status: 'error',
      error: 'Internal server error',
    });
  }
  next();
};
