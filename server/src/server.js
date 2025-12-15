import "dotenv/config";
import express, { json } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import sequelize, { createDB } from "./config/database.js";
import routes from "./routes/index.js";

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

app.use("/api/users", limiter);
app.use("/api", routes);
app.get("/health", (req, res) => res.json({ status: "ok" }));

async function start() {
  try {
    await createDB();
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    app.listen(process.env.EXPRESS_API_PORT, () =>
      console.log(
        `✅ Server started listening on port ${process.env.EXPRESS_API_PORT}`
      )
    );
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

start();
