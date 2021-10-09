import { StatusCodes } from "http-status-codes";

class CustomError extends Error {
  constructor(
    message = "Internal Server Error",
    status = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    this.statusCode = status;
  }
}

export default CustomError;
