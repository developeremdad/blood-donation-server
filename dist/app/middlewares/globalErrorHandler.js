"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const library_1 = require("@prisma/client/runtime/library");
const zod_1 = require("zod");
const handleZodError_1 = __importDefault(require("../errors/handleZodError"));
const globalErrorHandler = (err, req, res, next) => {
    //   console.log(err);
    let statusCode = 500;
    let message = "Something went wrong!";
    let errorDetails = {};
    if (err instanceof zod_1.ZodError) {
        // Handle Zod error
        const simplifiedError = (0, handleZodError_1.default)(err);
        statusCode = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.statusCode;
        message = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.message;
        errorDetails = simplifiedError === null || simplifiedError === void 0 ? void 0 : simplifiedError.errorDetails;
    }
    else if ((err === null || err === void 0 ? void 0 : err.code) === "P2002") {
        // Handle Prisma Duplicate entity error
        statusCode = 400;
        message = `Duplicate entity on the fields ${err.meta.target.map((field) => field)}`;
        errorDetails = err.message;
    }
    else if (err instanceof library_1.PrismaClientKnownRequestError) {
        // Handle specific Prisma known errors
        statusCode = 400;
        message = err.message;
        errorDetails = { code: err.code, meta: err.meta };
    }
    else if (err instanceof library_1.PrismaClientUnknownRequestError) {
        // Handle specific Prisma known errors
        statusCode = 400;
        message = err.message;
        errorDetails = err;
    }
    else if (err instanceof Error) {
        message = err.message;
        errorDetails = err.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorDetails,
    });
};
exports.default = globalErrorHandler;
