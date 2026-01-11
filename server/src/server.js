import "dotenv/config";
import express, { json } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createDB } from "./config/create-db.js";
import sequelize from "./config/database.js";
import routes from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
});

app.use(helmet());
app.use(cors(corsOptions));
app.use(json());

// app.use("/api/auth", limiter);
app.use("/api", routes);
app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use(errorHandler);

async function start() {
  const maxAttempts = 5;
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await createDB();
      await sequelize.authenticate();
      await sequelize.sync({ alter: true });
      app.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () =>
        console.log(
          `✅ Server started listening on port ${process.env.SERVER_PORT}`
        )
      );
      return;
    } catch (err) {
      console.error(
        `Attempt ${attempt} failed to start server:`,
        err.message || err
      );
      if (attempt === maxAttempts) {
        console.error("❌ Failed to start server after retries:", err);
        process.exit(1);
      }
      await delay(3000);
    }
  }
}

start();
