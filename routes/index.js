import { Router } from "express";
import authRoutes from "./auth.js";
import categoryRoutes from "./category.js";
import orderRoutes from "./order.js";
import paymentBRoutes from "./payment.js";
import productRoutes from "./product.js";
import userRoutes from "./user.js";

const router = Router();

router.route("/").get((req, res) => {
  res.send("Welcome!");
});

router.use(authRoutes);
router.use(userRoutes);
router.use(categoryRoutes);
router.use(productRoutes);
router.use(orderRoutes);
router.use(paymentBRoutes);

export default router;
