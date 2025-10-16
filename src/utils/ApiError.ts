// Extending the Core Node.js Error class
class ApiError extends Error {
  statusCode: number;
  data: null;
  success: boolean;
  errors: any[];

  //our own constructor
  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: any[] = [],
    stack: string = ""
  ) {
    super(message);

    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;
    // console.log("inside api error");

    //proper error line where error locating
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor); //context
    }
  }
}

export { ApiError };
