import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import "express-async-errors";
import { MONGO_URI, PORT } from "./config/env.js";
import connectMongo from "./db/connection.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFound from "./middlewares/notFound.js";
import uncaughtErrorHandler from "./middlewares/uncaughtErrorHandler.js";
import apiRoutes from "./routes/index.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Routes
app.use("/api", apiRoutes);

// Handle 404
app.use(notFound);

// Handle Errors
app.use(errorHandler);
// if express does not catch the error
process.on("uncaughtException", uncaughtErrorHandler);

// Run Server
try {
  // Starting server
  app.listen(PORT, () => {
    console.log(`app listening on http://localhost:${PORT}`);
  });

  // connect to database
  connectMongo(MONGO_URI);
} catch (err) {
  console.log(err);
}

export default app;
