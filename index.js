import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import AdminRoute from "./routes/AdminRoute.js";

dotenv.config();

const app = express();
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser());
app.use(express.json());
app.use(AdminRoute);

app.listen(5000, () => console.log("Server up and running"));
