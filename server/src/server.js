import "dotenv/config";
import express, { json } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import routes from "./presentation/routers/index.js";
import authRoutes from "./presentation/routers/authRouter.js";
import authenticate from "./presentation/middleware/authenticate.js";
import sequelize from "./shared/db/database.js";
import { createDB } from "./shared/db/create-db.js";
import { createAD } from "./shared/db/create-ad.js";
import errorHandler from "./presentation/middleware/errorHandler.js";
import httpLogger from "./presentation/middleware/httpLogger.js";

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Auth rate limit: 20 requests every 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth rate API: 300 requests every 1 minute
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(json());
app.use(httpLogger);

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api", apiLimiter, authenticate, routes);
app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use(errorHandler);

async function start() {
  const maxAttempts = 5;
  const wait = (ms) => new Promise((res) => setTimeout(res, ms));

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await createDB();
      await sequelize.authenticate();
      await sequelize.sync({ alter: true });
      await createAD();
      app.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () =>
        console.log(
          `✅ Server started listening on port ${process.env.SERVER_PORT}`,
        ),
      );
      return;
    } catch (err) {
      console.error(`Attempt ${attempt} failed to start server:`, {
        message: err.message || err,
      });
      if (attempt === maxAttempts) {
        console.error("❌ Failed to start server after retries:", { err });
        process.exit(1);
      }
      await wait(5000);
    }
  }
}

start();
