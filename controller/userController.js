import userModel from "../models/userModel.js";

export const updateController= async (req,res,next)=>{
    const{name, email,location,lastName}=req.body;
    if (!name || !email || !location ||!lastName){
        next("All Fields are required");
    }
    const user = await userModel.findOne({_id:req.user.userId});
    user.name=name;
    user.lastName=lastName;
    user.email=email;
    user.location=location;
    await user.save();

    const token = user.createJWT();
    res.status(200).json({
        success:true,
        message:"Update Successfully",
        user,
        token
    })
}