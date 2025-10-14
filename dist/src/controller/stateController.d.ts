import { NextFunction, Request, Response } from "express";
export declare const createState: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const getStateList: (req: any, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const getStateById: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const updateState: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const deleteState: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=stateController.d.ts.map