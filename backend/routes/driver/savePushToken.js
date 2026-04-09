import express from 'express'
import User from '../../models/User.js'


const router = express.Router()
router.post("/savePushToken",async(req,res)=>{
    
    try{
        const {driverId,pushToken} = req.body
        if(!driverId || !pushToken){
            return res.status(400).json({message:'Missing fields'})
        }
        await User.findByIdAndUpdate(driverId,{pushToken})
        res.status(200).json({message:'Push token saved'})
    }catch(error){
        console.error(error)
        res.status(500).json({message:'Server error'})
    }
})
export default router