import express from "express"
import User from "../../models/User.js"
const router = express.Router()

router.post("/find-all-near", async (req, res) => {
    // 1. Get current position from request
    const { lat, lng } = req.body

    if (lat == null || lng == null) {
        return res.status(400).json({ message: "Send lat and lng to search from!" })
    }

    try {
        // 2. Query for everything within 100km
        const locations = await User.find({
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

        // 3. Return what we found
        res.json({
            count: locations.length,
            results: locations
        })
    } catch (err) {
        res.status(500).json({ 
            message: "Check if you have a 2dsphere index!", 
            error: err.message 
        })
    }
})

export default router