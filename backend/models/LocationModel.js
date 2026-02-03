import mongoose from "mongoose";

const TestLocationSchema = new mongoose.Schema({
  name: String,
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  }
});

// IMPORTANT: The index is what makes $near work
TestLocationSchema.index({ location: "2dsphere" });

export default mongoose.models.TestLocation || mongoose.model("TestLocation", TestLocationSchema);