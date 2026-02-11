import express from "express"
import Ride from "../models/rideSchema.js"
import {io,onlineDrivers} from "../server.js"
import User from "../models/User.js"

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
        const drivers = await User.find({
                    role:"driver",
                    isOnline:true,
                    location: {
                        $near: {
                            $geometry: {
                                type: "Point",
                                coordinates: [parseFloat(lng), parseFloat(lat)] // [Longitude, Latitude]
                            },
                            $maxDistance: 100000 // 100 kilometers
                        }
                    }
                })    
                console.log("Drivers found:", drivers.length);

                console.log("Online drivers map:", onlineDrivers);

                drivers.forEach(driver =>{
                            const socketId = onlineDrivers.get(driver._id.toString())
                            if(socketId){
                                io.to(socketId).emit("new_ride_request",{
                                    rideId :ride._id,
                                    pickup: { name: depart, location: { lat, lng } },
                                    destination: { name: destination }
                                })
                                  console.log("Driver:", driver._id.toString(), "Socket:", socketId);
                            }
                        
})
    }catch(error){
        console.error("Ride Request Error: ",error)
        res.status(500).json({
            message:"Server error"
        })
    }
})
export default router
