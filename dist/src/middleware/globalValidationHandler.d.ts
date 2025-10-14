import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
type ValidationTarget = "body" | "query" | "params";
export declare const globalValidator: (schema: ObjectSchema, target: ValidationTarget) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=globalValidationHandler.d.ts.map