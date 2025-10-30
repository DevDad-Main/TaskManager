import express from "express";
import "dotenv/config";

//#region Constants
const app = express();
//#endregion

//#region Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//#endregion

//#region Endpoints
app.use("/", (req, res) => {
  res.send("Hello World!");
});
//#endregion

export default app;
