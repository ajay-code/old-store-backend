import express from "express";
import { isAuthenticated, isSignedIn } from "../controllers/authController.js";
import {
  getUser,
  getUserById,
  updateUser,
  userPurchaseList,
} from "../controllers/userController.js";
let r;
const userRouter = (r = express.Router());

r.param("userId", getUserById);

r.route("/users/:userId")
  .get(isSignedIn, isAuthenticated, getUser)
  .put(isSignedIn, isAuthenticated, updateUser);

r.route("/users/:userId/orders").get(
  isSignedIn,
  isAuthenticated,
  userPurchaseList
);
export default userRouter;
