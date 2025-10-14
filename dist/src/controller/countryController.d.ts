import { Request, Response } from "express";
export declare const createCountry: (req: Request, res: Response) => Promise<void | Response<any, Record<string, any>>>;
export declare const getCountryList: (req: Request, res: Response) => Promise<void | Response<any, Record<string, any>>>;
export declare const getCountryById: (req: Request, res: Response) => Promise<void | Response<any, Record<string, any>>>;
export declare const updateCountry: (req: Request, res: Response) => Promise<void | Response<any, Record<string, any>>>;
export declare const deleteCountry: (req: Request, res: Response) => Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=countryController.d.ts.map