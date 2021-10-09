import { Order } from "../models/Order.js";
import User from "../models/User.js";
import { BadRequestError, NotFoundError } from "./../errors/index.js";

export const getUserById = async (req, res, next, id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  req.profile = user;
  next();
};

export const getUser = (req, res) => {
  const user = req.profile.toObject();
  delete user.salt;
  delete user.encry_password;
  return res.json({ user });
};

export const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    {
      _id: req.profile._id,
    },
    { $set: req.body },
    { new: true, useFindAndModify: false }
  );
  if (!user) {
    throw new BadRequestError("User not updated");
  }
  user.salt = undefined;
  user.encry_password = undefined;
  res.json({ user });
};

export const userPurchaseList = async (req, res) => {
  const purchaseList = await Order.find({ user: req.profile._id }).populate(
    "user",
    "_id name"
  );
  if (!purchaseList) {
    throw new BadRequestError("No Order in this account");
  }
  res.json({ purchaseList });
};

// Middlewares
export const pushOrdersInPurchaseList = async (req, res, next) => {
  let purchases = [];
  req.body.order.products.forEach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });

  // store this in DB

  const result = await User.findOneAndUpdate(
    { _id: req.profile._id },
    {
      $push: {
        purchases: purchases,
      },
    },
    { new: true }
  );

  if (!result) {
    throw new BadRequestError("Unable to save purchase list");
  }

  next();
};
