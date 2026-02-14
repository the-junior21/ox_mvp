import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import roleRoutes from "./routes/role.route.js";
import userRoutes from "./routes/users/user.routes.js";
import driverStatus from "./routes/driver/status.js";
import passengerRoute from "./routes/passenger.js";
import updateDriverLocation from "./routes/driver/location.js";
import updatePassengerLocation from "./routes/passengerLocation/location.js";
import nearbyDrivers from "./routes/driver/nearby.js";
import rideRequest from "./routes/rideRequest.js";
import rideRequestId from "./routes/rideRequestId/:id.js";
import { createServer } from "http";
import { Server } from "socket.io";
import Ride from "./models/rideSchema.js";
import User from "./models/User.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const onlineDrivers = new Map();
const onlinePassengers = new Map();

io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);
  socket.on("accept_ride", async ({ driverId, rideId }) => {
    try {
      const ride = await Ride.findById(rideId);
      console.log("Looking for passenger:", ride.passengerId.toString());
      console.log("Online passengers:", onlinePassengers);
      console.log("Found socket:", passengerSocketId);

      socket.on("register_passenger", (passengerId) => {
        onlinePassengers.set(passengerId, socket.id);
        console.log("Passenger registered:", passengerId);
      });

      if (!ride) return;
      if (ride.status !== "SEARCHING") {
        console.log("already taken");
        return;
      }
      const passengerSocketId = onlinePassengers.get(
        ride.passengerId.toString(),
      );
      if (passergerSocketId) {
        io.to(passengerSocketId).emit("ride_accepted", {
          rideId: ride._id,
          driverId,
        });
      }
      socket.emit("ride_confirmed", {
        rideId: ride._id,
      });
      await User.findByIdAndUpdate(driverId, {
        status: "ON_TRIP",
      });
      // assign the driver
      ride.status = "ACCEPTED";
      ride.driverId = driverId;
      await ride.save();
      console.log("ride accepted by ", driverId);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("driver_online", (driverId) => {
    onlineDrivers.set(driverId, socket.id);
    console.log("✅ Driver ONLINE:", driverId, socket.id);
  });
  socket.on("passenger_online", (passengerId) => {
    onlinePassengers.set(passengerId, socket.id);
    console.log("✅ passenger ONLINE:", passengerId, socket.id);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Remove from maps
    [...onlineDrivers].forEach(
      ([id, sId]) => sId === socket.id && onlineDrivers.delete(id),
    );
    [...onlinePassengers].forEach(
      ([id, sId]) => sId === socket.id && onlinePassengers.delete(id),
    );
  });
});

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/auth", roleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/driver", driverStatus);
app.use("/api/passenger", passengerRoute);
app.use("/api/driver/location", updateDriverLocation);
app.use("/api/passenger/location", updatePassengerLocation);
app.use("/api/driver/nearby", nearbyDrivers);
app.use("/api/routes/rideRequest", rideRequest);
app.use("/api/routes/rideRequestId", rideRequestId);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export { io, onlineDrivers, onlinePassengers };

export default app;
