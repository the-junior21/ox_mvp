import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    number: { type: String, required: true, unique: false },

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
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: false,
      },
    },
    status:{
      type:String,
      enum:["ON_TRIP","OFF_TRIP"],
      default:"OFF_TRIP"
    }
  },
  { timestamps: true }
);

// 🔥 THIS index is now VALID
UserSchema.index(
  { location: "2dsphere" }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);
