import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    number: { type: String, required: true, unique: true },

    role: {
      type: String,
      enum: ["passenger", "driver"],
      default: "passenger",
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },
  },
  { timestamps: true }
);

// 🔥 THIS index is now VALID
UserSchema.index({ location: "2dsphere" });

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);
