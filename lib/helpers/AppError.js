"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Module dependencies
 */
const AppErrorCodes = {
    serverError: 'SERVER_ERROR',
};
class AppError extends Error {
    constructor(message, options) {
        super(message);
        // Set HTTP status code
        this.status = options?.status || 500;
        // Set API error code
        this.code = options?.code || AppErrorCodes.serverError;
        // Ensures that stack trace uses our subclass name
        this.name = this.constructor.name;
        // Share clean messages for api feedback
        if (options?.details)
            this.details = options?.details;
        else
            this.details = [{ message }];
        // Ensures the AppError subclass is sliced out of the
        // stack trace dump for clarity
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = AppError;
//# sourceMappingURL=AppError.js.map