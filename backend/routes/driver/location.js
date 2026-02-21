import User from  "../../models/User.js"
//jus adding a comment to check 
import express from "express"
const router = express.Router()
router.post("/", async(req,res) => {
const {driverId,lat,lng}= req.body
if(!driverId || lat == null || lng == null){
    return res.status(400).json({message:"missing data"})
}
try{
    await User.findByIdAndUpdate(driverId,{
        location:{
            lat:lat,
            lng:lng,
        },
        updatedAt: new Date(),
    })
    res.json({success:true})
}catch (err){
    res.status(500).json({message:"server error"})
}
})
export default router

