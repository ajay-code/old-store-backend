import { StatusCodes } from "http-status-codes";
import customError from "./customError.js";

class ForbiddenError extends customError {
  constructor(message = "FORBIDDEN") {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

export default ForbiddenError;
