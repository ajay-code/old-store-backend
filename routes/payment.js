import { Router } from "express";
import { isAuthenticated, isSignedIn } from "../controllers/authController.js";
import { getToken, processPayment } from "../controllers/paymentBController.js";
import { getUserById } from "../controllers/userController.js";

let r;
const paymentBRouter = (r = Router());

r.param("userId", getUserById);
r.route("/payment/get-token/:userId", isSignedIn, isAuthenticated).get(
  getToken
);
r.route("/payment/braintree/:userId", isSignedIn, isAuthenticated).post(
  processPayment
);

export default paymentBRouter;
