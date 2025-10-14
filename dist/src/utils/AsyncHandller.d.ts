import { Request, Response, NextFunction, RequestHandler } from "express";
type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;
declare const asyncHandler: (requestHandler: AsyncRequestHandler) => RequestHandler;
export { asyncHandler };
//# sourceMappingURL=AsyncHandller.d.ts.map