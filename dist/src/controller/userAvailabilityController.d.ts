import { NextFunction, Request, Response } from "express";
export declare const userAvailability: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const getUserAvailabilityList: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=userAvailabilityController.d.ts.map