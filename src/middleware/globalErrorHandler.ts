import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/ApiResponse";

//Global Error Handler
const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";
  const message = err.message;

  return res.status(statusCode).json(new ApiResponse(statusCode, message, {}));
};
export default globalErrorHandler;
