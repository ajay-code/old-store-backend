import mongoose from "mongoose";

const { Schema } = mongoose;

const ProductCartSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  name: String,
  count: Number,
  price: Number,
});

const OrderSchema = new Schema(
  {
    products: [ProductCartSchema],
    transaction_id: {
      type: String,
    },
    amount: { type: Number },
    address: String,
    status: {
      type: String,
      default: "Received",
      emum: ["Cancelled", "Delivered", "Shipped", "Processing", "Received"],
    },
    updated: Date,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const ProductCart = mongoose.model("ProductCart", ProductCartSchema);

const Order = mongoose.model("Order", OrderSchema);
export { Order, ProductCart };
