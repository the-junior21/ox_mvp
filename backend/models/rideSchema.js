import mongoose from "mongoose"

const RideSchema = new mongoose.Schema(
    {
        passenger :{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        driver:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:null,
        },
        pickup:{
            name:String,
            location:{
                type:{
                    type:String,
                    enum:["Point"],
                    default:"Point",
                },
                coordinates:{
                    type:[Number],
                    required:true,
                },
            },
        },
        destination:{
            name:String,
        },
        status: {
      type: String,
      enum: [
        "SEARCHING",
        "ACCEPTED",
        "ARRIVED",
        "ONGOING",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "SEARCHING",
        },
    },
    {timestamps:true}
)
RideSchema.index({"pickup.location":"2dsphere"})
export default mongoose.model("Ride",RideSchema)