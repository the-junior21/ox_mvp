import express from "express"
import User from "../../models/User.js"
import {io} from "../../server.js"
import {onlineDrivers} from "../../server.js"


const router = express.Router()

router.post("/find-all-near", async (req, res) => {
    // 1. Get current position from request
    const { lat, lng,rideId } = req.body

    if (lat == null || lng == null) {
        return res.status(400).json({ message: "Send lat and lng to search from!" })
    }

    try {
        // 2. Query for everything within 100km
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
        drivers.forEach(driver =>{
            const socketId = onlineDrivers.get(driver._id.toString())
            if(socketId){
                io.to(socketId).emit("new_ride_request",{
                    rideId,
                    passengerLocation:{lat,lng}
                })
            }
        })


        // 3. Return what we found
        res.json({
            count: drivers.length,
            results: drivers
        })
    } catch (err) {
        res.status(500).json({ 
            message: "Check if you have a 2dsphere index!", 
            error: err.message 
        })
    }
})

export default router