import express from "express"
import Ride from "../models/rideSchema.js"
const router = express.Router()
router.post("/",async(req,res)=>{
    try{
        const {passengerId ,depart,destination,pickupLocation} = req.body
        if(
            !passengerId || 
            !depart || 
            !destination || 
            !pickupLocation?.lat || !pickupLocation?.lng
        ){
            return res.status(400).json({
                message:"Missing required fields",
            })
        }
        const {lat , lng} = pickupLocation;

        const ride = await Ride.create({
            passenger : passengerId,
            pickup:{
                name:depart,
                location:{
                    type:"Point",
                    coordinates:[pickupLocation.lng,pickupLocation.lat],
                },
            },
            destination:{
                name:destination,
            },
            status:"SEARCHING",
        })
        res.status(201).json({
            message:"Ride request created",
            rideId:ride._id,
            status:ride.status,
        })
    }catch(error){
        console.error("Ride Request Error: ",error)
        res.status(500).json({
            message:"Server error"
        })
    }
})
export default router
