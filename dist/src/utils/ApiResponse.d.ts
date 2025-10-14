declare class ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T | null;
    success: boolean;
    constructor(statusCode: number, message: string | undefined, data: T | null);
}
declare const successResponse: <T>(data: T, message?: string) => ApiResponse<T>;
declare const errorResponse: (message?: string, statusCode?: number) => ApiResponse<null>;
export { ApiResponse, successResponse, errorResponse };
//# sourceMappingURL=ApiResponse.d.ts.map