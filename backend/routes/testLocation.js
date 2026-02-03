import express from "express";
import TestLocation from "../models/LocationModel.js";
const router = express.Router();

// 1. SEED DATA: Run this once to put a point in the DB
router.post("/seed", async (req, res) => {
    try {
        await TestLocation.deleteMany({}); // Clear old test data
        await TestLocation.create({
            name: "Nearby Point (500m away)",
            location: { type: "Point", coordinates: [3.0588,36.7538] } // London Example
        });
        res.json({ message: "Seed successful" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. SEARCH: Find points within 10km
router.post("/search", async (req, res) => {
    const { lat, lng } = req.body;
    try {
        const results = await TestLocation.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: 10000 // 10km
                }
            }
        });
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;