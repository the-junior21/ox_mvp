import express from "express"
import rideSchema from "../models/rideSchema.js"
const router = express.Router()
router.post("/",async(req,res)=>{
    try{
        const {passengerId ,depart,destination,lat,lng} = req.body
        if(!passengerId || !depart || !destination || !lat || !lng){
            return res.status(400).json({
                message:"Missing required fields",
            })
        }
        const ride = await Ride.create({
            passenger : passengerId,
            pickup:{
                name:depart,
                location:{
                    coordinates:[lng,lat],
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
