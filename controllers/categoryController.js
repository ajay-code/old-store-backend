import { BadRequestError } from "../errors/index.js";
import Category from "../models/Category.js";

export const getCategoryById = async (req, res, next, id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new BadRequestError("Category Not Found");
  }
  req.category = category;
  next();
};

export const getCategory = (req, res) => {
  const category = req.category;
  res.json(category);
};

export const getAllCategories = async (req, res) => {
  const categories = await Category.find().select("_id name");

  if (!categories) {
    throw new BadRequestError("No Categories found");
  }

  res.json(categories);
};

export const createCategory = async (req, res) => {
  const category = new Category(req.body);
  if (!category) {
    throw new BadRequestError("Not able to save category");
  }
  category.save();
  return res.json(category);
};

export const updateCategory = async (req, res) => {
  const category = req.category;
  category.name = req.body.name;
  const updatedCategory = await category.save();

  if (!updatedCategory) {
    throw new BadRequestError("Not able to update category");
  }

  return res.json(updatedCategory);
};

export const removeCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.category._id);
  if (!category) {
    throw new BadRequestError("Failed to delete category");
  }
  res.json({ category, message: "Successfully deleted" });
};
