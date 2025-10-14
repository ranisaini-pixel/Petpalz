import { NextFunction, Request, Response } from "express";
export declare const registerStudent: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const loginStudent: (req: Request, res: Response) => Promise<void | Response<any, Record<string, any>>>;
export declare const getStudentById: (req: Request, res: Response) => Promise<void | Response<any, Record<string, any>>>;
export declare const getStudentList: (req: Request, res: Response) => Promise<void | Response<any, Record<string, any>>>;
export declare const updateStudent: (req: Request, res: Response) => Promise<void | Response<any, Record<string, any>>>;
export declare const deleteStudent: (req: Request, res: Response) => Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=studentController.d.ts.map