import NotFoundError from "../errors/notFoundError.js";

const notFound = (req, res, next) => {
  const error = new NotFoundError();
  next(error);
};

export default notFound;
