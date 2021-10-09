import { Router } from "express";
import { check } from "express-validator";
import { signin, signout, signup } from "../controllers/authController.js";

let r;
const authRouter = (r = Router());

r.route("/signup").post(
  [
    check("name", "name must be at least 3 chars long").isLength({ min: 3 }),
    check("email", "valid email is required").isEmail(),
    check("password", "password should be at least 3 chars long").isLength({
      min: 3,
    }),
  ],
  signup
);

r.route("/signin").post(
  [
    check("email", "valid email is required").isEmail(),
    check("password", "password field is required").isLength({
      min: 1,
    }),
  ],
  signin
);

r.route("/signout").get(signout);

export default authRouter;
