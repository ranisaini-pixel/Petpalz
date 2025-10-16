import { Request, Response, NextFunction } from "express";
import { any, ObjectSchema } from "joi";

type ValidationTarget = "body" | "query" | "params";

export const globalValidator = (
  schema: ObjectSchema,
  target: ValidationTarget
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const value = await schema.validateAsync(req[target], {
        abortEarly: false,
      });

      //this will replace previous value with the new value
      req[target] = value;
      // Object.assign(req[target], value);

      next();
    } catch (error) {
      console.log("Error", error);
      if (error)
        return res.status(400).json({
          code: 400,
          message: "Validation failed",
          errors: error,
        });
    }
  };
};
