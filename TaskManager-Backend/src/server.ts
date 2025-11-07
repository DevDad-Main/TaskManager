import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { xss } from "express-xss-sanitizer";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import userRouter from "./routes/user.route";

//#region Constants
const app = express();
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
//#endregion

//#region Middleware
// Global rate limiting
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "device-remember-token",
      "Access-Control-Allow-Origin",
      "Origin",
      "Accept",
    ],
  }),
);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Security Middleware
app.use(helmet()); // Set security HTTP headers
app.use(xss()); // Data sanitization against XSS
app.use(hpp()); // Prevent HTTP Parameter Pollution
app.use("/api", limiter); // Apply rate limiting to all routes

const env = process.env.NODE_ENV || "development"; // fallback
if (env === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//#endregion

//#region Endpoints
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.use("/api/v1/user", userRouter);
//#endregion

export default app;
