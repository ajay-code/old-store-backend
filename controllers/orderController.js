import { Order } from "../models/Order.js";
import BadRequestError from "./../errors/badRequestError.js";

export const getOrderById = async (req, res, next, id) => {
  const order = await Order.findById(id).populate(
    "products.product",
    "name price"
  );
  if (!order) {
    throw new BadRequestError("No order found");
  }
  req.order = order;
  next();
};

export const createOrder = async (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  const savedOrder = await order.save();
  if (!savedOrder) {
    throw new BadRequestError("Failed to save order");
  }
};

export const getAllOrders = async (req, res) => {
  const orders = await Order.find().populate("user", "_id name");

  if (!orders) {
    throw new BadRequestError("No orders found");
  }

  return res.json(orders);
};

export const updateOrderStatus = async (req, res) => {
  const order = await Order.findOneAndUpdate(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } }
  );

  if (!order) {
    throw new BadRequestError("Cannot update the status");
  }

  return res.json(order);
};

export const getOrderStatus = async (req, res) => {
  return res.json(Order.schema.path("status").enumValues);
};
