import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
} from "@prisma/client/runtime/library";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import handleZodError from "../errors/handleZodError";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //   console.log(err);
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorDetails = {};

  if (err instanceof ZodError) {
    // Handle Zod error
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorDetails = simplifiedError?.errorDetails;
  } else if (err?.code === "P2002") {
    // Handle Prisma Duplicate entity error
    statusCode = 400;
    message = `Duplicate entity on the fields ${err.meta.target.map(
      (field: string) => field
    )}`;
    errorDetails = err.message;
  } else if (err instanceof PrismaClientKnownRequestError) {
    // Handle specific Prisma known errors
    statusCode = 400;
    message = err.message;
    errorDetails = { code: err.code, meta: err.meta };
  } else if (err instanceof PrismaClientUnknownRequestError) {
    // Handle specific Prisma known errors
    statusCode = 400;
    message = err.message;
    errorDetails = err;
  } else if (err instanceof Error) {
    message = err.message;
    errorDetails = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
  });
};

export default globalErrorHandler;
