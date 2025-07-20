import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

//creating app using express
const app = express();

// setup cors
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//setting limit for json when form sumitting
app.use(express.json({ limit: "50kb" }));
// handling data comming from URL
app.use(express.urlencoded({ extended: true, limit: "50kb" }));
// storing img/files on my server if needed
app.use(express.static("public"));
//handling cookies
app.use(cookieParser());

//routes import
import userRouter from "./routes/user.routes.js";

//routes declaration (~ http://localhost:8000/api/v1/users/register)
app.use("/api/v1/users", userRouter);

//exporting app
export { app };
