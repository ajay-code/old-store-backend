import expressJwt from "express-jwt";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { SECRET } from "../config/env.js";
import {
  BadRequestError,
  CustomError,
  ForbiddenError,
  UnauthenticatedError,
} from "../errors/index.js";
import User from "../models/User.js";

export const signup = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      error: errors.array()[0].msg,
    });
  }

  const data = req.body;
  const user = new User(data);

  const savedUser = await user.save();
  if (!savedUser) {
    throw new BadRequestError("Not able to save user in DB");
  }
  return res.json({
    name: savedUser.name,
    lastname: savedUser.lastname,
    email: savedUser.email,
    id: savedUser._id,
  });
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      error: errors.array()[0].msg,
    });
  }

  const user = await User.findOne({ email });

  // if no user found
  if (!user) {
    throw new BadRequestError("email or password do not match");
  }

  // authenticate user
  if (!user.authenticate(password)) {
    throw new CustomError(
      "email or password do not match",
      StatusCodes.UNAUTHORIZED
    );
  }

  // crete token
  const token = jwt.sign({ _id: user._id }, SECRET);

  res.cookie("token", token, { expire: new Date() + 9999 });

  const { _id, name, email: userEmail, role } = user;
  return res.json({ token, user: { _id, name, email: userEmail, role } });
};

export const signout = (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "user signout successfully" });
};

//  protected routes
export const isSignedIn = expressJwt({
  secret: SECRET,
  userProperty: "auth",
});

// custom middlewares
export const isAuthenticated = (req, res, next) => {
  const checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    throw new UnauthenticatedError("ACCESS DENIED AUTH");
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    throw new ForbiddenError("ACCESS DENIED ADMIN");
  }
  next();
};
