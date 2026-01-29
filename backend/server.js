import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import roleRoutes from "./routes/role.route.js";
import userRoutes from "./routes/users/user.routes.js";
import driverStatus from "./routes/driver/status.js"
import passengerRoute from "./routes/passenger.js"
import { updateDriverLocation } from "./routes/driver/location.js";

dotenv.config();

const app = express();
app.use(cors(
  {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }
));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/auth", roleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/driver", driverStatus);
app.use("/api/passenger",passengerRoute)
app.use("/api/driver/location",updateDriverLocation)


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.error(err));

export default app
