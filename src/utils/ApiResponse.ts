class ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T | null;
  success: boolean;

  constructor(statusCode: number, message: string = "Success", data: T | null) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
  }
}

// export { ApiResponse };

const successResponse = <T>(
  data: T,
  message: string = "Success"
): ApiResponse<T> => {
  return new ApiResponse<T>(200, message, data);
};

const errorResponse = (
  message: string = "Error",
  statusCode: number = 400
): ApiResponse<null> => {
  return new ApiResponse<null>(statusCode, message, null);
};

export { ApiResponse, successResponse, errorResponse };
