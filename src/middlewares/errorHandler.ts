import { NextFunction, Request, Response } from "express";
import { TypeORMError } from "typeorm";

class GeneralError extends Error {
  public message: string;
  public status: number;

  constructor(message = "Internal Server Error", status = 500) {
    super(message);

    this.message = message;
    this.status = status;
  }
}

// ESLint false-positive with Express.js method overloading.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorMiddleware =
  () =>
  (err: GeneralError, req: Request, res: Response, next: NextFunction) => {
    console.log(111111111)
    const message = err.message;
    const status = err.status || 500;

    console.error("\x1b[31m", err.stack);

    if (err instanceof TypeORMError) {
      return res
        .status(status)
        .send({ error: { code: err.status, meta: err.stack, status } });
    }

    return res.status(status).send({ error: { message, status } });
  };

export default errorMiddleware;
