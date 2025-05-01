// server.js or app.js
import express from "express";
import uploadRoutes from "./routes/products.routes.js";

import cors from "cors";

const app = express();

// cors cofig
app.use(cors());

// Middleware to handle JSON requests and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/first", (req, res) => {
  console.log("hello first check");
  res.status(200).send({ message: "working" });
});

// Static folder to serve uploads
// app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// Routes
app.use("/api", uploadRoutes);

export default app;
