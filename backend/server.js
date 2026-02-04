import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import roleRoutes from "./routes/role.route.js";
import userRoutes from "./routes/users/user.routes.js";
import driverStatus from "./routes/driver/status.js"
import passengerRoute from "./routes/passenger.js"
import updateDriverLocation  from "./routes/driver/location.js";
import updatePassengerLocation  from "./routes/passengerLocation/location.js";
import nearbyDrivers  from "./routes/driver/nearby.js";


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
app.use("/api/passenger/location",updatePassengerLocation)
app.use("/api/driver/nearby",nearbyDrivers)
app.use("/api/nearby",testLocation)


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch(err => console.error(err));


  const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


export default app
