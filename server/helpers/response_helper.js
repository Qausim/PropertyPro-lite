export default class ResponseHelper {
  static getSuccessResponse(response, data, code) {
    return response.status(code || 200).json({
      status: 'success',
      data,
    });
  }

  static getNotFoundErrorResponse(response) {
    return response.status(404).json({
      status: 'error',
      error: 'Not found',
    });
  }

  static getForbiddenErrorResponse(response, message) {
    return response.status(403).json({
      status: 'error',
      error: message,
    });
  }

  static getUnauthorizedErrorResponse(response, message) {
    return response.status(401).json({
      status: 'error',
      error: message || 'Unauthorized request',
    });
  }

  static getConflictErrorResponse(response, message) {
    return response.status(409).json({
      status: 'error',
      error: message,
    });
  }

  static getBadRequestErrorResponse(response, message) {
    return response.status(400).json({
      status: 'error',
      error: message,
    });
  }

  static getInternalServerError(response) {
    return response.status(500).json({
      status: 'error',
      error: 'Internal server error',
    });
  }
}
