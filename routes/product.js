import express from "express";
import {
  isAdmin,
  isAuthenticated,
  isSignedIn,
} from "../controllers/authController.js";
import {
  createProduct,
  getAllProducts,
  getAllUniqueCategories,
  getProduct,
  getProductById,
  photo,
  removeProduct,
  updateProduct,
} from "../controllers/productController.js";
import { getUserById } from "../controllers/userController.js";

let r;
const productRouter = (r = express.Router());

r.param("userId", getUserById);
r.param("productId", getProductById);

r.route("/products/:userId", isSignedIn, isAuthenticated, isAdmin).post(
  createProduct
);

r.route("/products/:productId").get(getProduct);
r.route("/products/photo/:productId").get(photo);
r.route("/products/:productId/:userId", isSignedIn, isAuthenticated, isAdmin)
  .put(updateProduct)
  .delete(removeProduct);

// listing route
r.route("/products").get(getAllProducts);
r.route("/products/categories").get(getAllUniqueCategories);

export default productRouter;
