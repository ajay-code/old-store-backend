import express from "express";
import {
  isAdmin,
  isAuthenticated,
  isSignedIn,
} from "../controllers/authController.js";
import {
  createCategory,
  getAllCategories,
  getCategory,
  getCategoryById,
  removeCategory,
  updateCategory,
} from "../controllers/categoryController.js";
import { getUserById } from "../controllers/userController.js";

let r;
const categoryRouter = (r = express.Router());

r.param("userId", getUserById);
r.param("categoryId", getCategoryById);

r.route("/categories").get(getAllCategories);

r.route("/categories/:categoryId").get(getCategory);

r.route("/categories/:userId", isSignedIn, isAuthenticated, isAdmin).post(
  createCategory
);

r.route("/categories/:categoryId/:userId", isSignedIn, isAuthenticated, isAdmin)
  .put(updateCategory)
  .delete(removeCategory);

export default categoryRouter;
