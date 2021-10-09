import formidable from "formidable";
import fs from "fs";
import _ from "lodash";
import { BadRequestError } from "../errors/index.js";
import Product from "../models/Product.js";

export const getProductById = async (req, res, next, id) => {
  const product = await Product.findById(id).populate("category");
  if (!product) {
    throw new BadRequestError("Product Not Found");
  }
  req.product = product;

  next();
};

export const createProduct = async (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        console.log(err);
        throw new BadRequestError("problem with image");
      }

      const { name, description, price, category, stock } = fields;

      if (!name || !description || !price || !category || !stock) {
        throw new BadRequestError("Please include all fields");
      }

      let product = new Product(fields);

      // handle file here
      if (files.photo) {
        if (files.photo.size > 3000000) {
          throw new BadRequestError("File size is too big!");
        }
        product.photo.data = fs.readFileSync(files.photo.path);
        product.photo.contentType = files.photo.type;
      }

      // save to the DB
      const savedProduct = await product.save();
      if (!savedProduct) {
        throw new BadRequestError("Not able to save product");
      }
      savedProduct.photo = undefined;
      return res.json(savedProduct);
    } catch (err) {
      return next(err);
    }
  });
};

export const updateProduct = async (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    try {
      if (err) {
        throw new BadRequestError("problem with image");
      }

      const { name, description, price, category, stock } = fields;

      if (
        !name &&
        !description &&
        !price &&
        !category &&
        !stock &&
        !files.photo
      ) {
        throw new BadRequestError("Please update at least one fields");
      }

      // update product
      let product = req.product;
      product = _.extend(product, fields);

      // handle file here
      if (files.photo) {
        if (files.photo.size > 3000000) {
          throw new BadRequestError("File size is too big!");
        }
        product.photo.data = fs.readFileSync(files.photo.path);
        product.photo.contentType = files.photo.type;
      }

      // save to the DB
      const savedProduct = await product.save();
      if (!savedProduct) {
        throw new BadRequestError("Updation of product failed");
      }

      savedProduct.photo = undefined;

      return res.json(savedProduct);
    } catch (err) {
      return next(err);
    }
  });
};

export const removeProduct = async (req, res) => {
  const product = req.product;
  const deletedProduct = await product.delete();
  if (!deletedProduct) {
    throw new BadRequestError("Failed to delete product");
  }

  return res.json({
    message: "Product deleted successfully",
  });
};

export const getProduct = (req, res) => {
  const product = req.product.toObject();
  delete product.photo;
  return res.json({ ...product, category: product.category._id });
};

// product listing
export const getAllProducts = async (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy || "_id";

  const products = await Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit);

  if (!products) {
    throw new BadRequestError("No Products available");
  }

  return res.json(products);
};

export const getAllUniqueCategories = async (req, res) => {
  const categories = await Product.distinct("category", {});
  if (!categories) {
    throw new BadRequestError("No category found");
  }
  return res.json(categories);
};

// Middleware
export const photo = (req, res, next) => {
  if (req.product.photo) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

export const updateStock = async (req, res, next) => {
  let myOperations = req.body.order.products.map((product) => {
    return {
      updateOne: {
        filter: { _id: product._id },
        update: { $inc: { stock: -product.count, sold: +product.count } },
      },
    };
  });

  const result = await Product.bulkWrite(myOperations, {});
  if (!result) {
    throw new BadRequestError("Bulk operation failed");
  }
  next();
};
