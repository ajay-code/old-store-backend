import { StatusCodes } from "http-status-codes";
import customError from "./customError.js";

class UnauthenticatedError extends customError {
  constructor(message = "Unauthorized") {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export default UnauthenticatedError;
