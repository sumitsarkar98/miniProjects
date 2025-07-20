// handling errors of api
class ApiError extends Error {
  constructor(
    statuscode,
    message = "somthing went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statuscode = statuscode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    //handle stack
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

//exportig
export { ApiError };
