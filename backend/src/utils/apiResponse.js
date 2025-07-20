// handling response/errors of api
class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode; // HTTP status code (e.g., 200, 404, 500)
    this.data = data; // The actual response data
    this.message = message; // Default message is "Success" unless overridden
    this.success = statusCode < 400; // Determines if the request was successful (status codes below 400 are successful)
  }
}
export { ApiResponse };
