import express from "express"
import User from "../../models/User"
const router  = express.Router()
router.post("/",async(req,res)=>{
    const {lat,lng} = req.body

    if(lat == null || lng == null){
        return res.status(400).json({message:"missing coords"})
    }
    try{
        const drivers = await User.find({
            role:"driver",
            isOnline:true,
            location:{
                $near:{
                    $geometry:{
                        type:"Ponit",
                        coordinates:[lng,lat]
                    },
                    $maxDistance:1000
                }
            }
        }).select("name location")
        res.json(drivers)
    }catch(err){
        res.status(500).json({message:err.message})
    }
})
export default router