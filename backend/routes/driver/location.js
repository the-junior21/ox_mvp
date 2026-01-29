import User from  "../../models/User"
export const updateDriverLocation = async(req,res) => {
const {driverId,lat,lng}= req.body
if(!driverId || lat == null || lng == null){
    return res.status(400).json({message:"missing data"})
}
try{
    await Driver.findByIdAndUpdate(driverId,{
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
}

