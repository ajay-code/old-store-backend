import express from "express";
import {
  isAdmin,
  isAuthenticated,
  isSignedIn,
} from "../controllers/authController.js";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrderStatus,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { getUserById } from "../controllers/userController.js";
import { updateStock } from "./../controllers/productController.js";
import { pushOrdersInPurchaseList } from "./../controllers/userController.js";
let r;
const orderRouter = (r = express.Router());

r.param("userId", getUserById);
r.param("orderId", getOrderById);

// create
r.route(
  "/orders/:userId",
  isSignedIn,
  isAuthenticated,
  pushOrdersInPurchaseList,
  updateStock
).post(createOrder);

// read
r.route("/orders/:userId", isSignedIn, isAuthenticated, isAdmin).get(
  getAllOrders
);

// status
r.route("/orders/status/:userId", isSignedIn, isAuthenticated, isAdmin).get(
  getOrderStatus
);

// update
r.route(
  "/orders/:orderId/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin
).put(updateOrderStatus);

export default orderRouter;
