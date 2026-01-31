import User from  "../../models/User.js"
//jus adding a comment to check 
// a justnwanna ssay nikmok yalli matefhemch  a weld l9e7ab
import express from "express"
const router = express.Router()
router.post("/", async(req,res) => {
const {passengerId,lat,lng}= req.body
if(!passengerId || lat == null || lng == null){
    return res.status(400).json({message:"missing data"})
}
try{
    await User.findByIdAndUpdate(passengerId,{
        location:{
            type:"Point",
            coordinates:[lng,lat],
        },
        updatedAt: new Date(),
    })
    res.json({success:true})
}catch (err){
    res.status(500).json({message:"server error"})
}
})
export default router

