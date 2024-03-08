import userModel from "../models/userModel.js";

export const registerController=async ( req,res,next)=>{
    
        const {name,email,password}=req.body;
        if(!name){
            next("Name is required");
        }
        if(!email){
            next("email is required");
        }
        if(!password){
            next("Password is required");
        }

        const existing=await userModel.findOne({email});
        if (existing){
            next(" user is already Registered");
        }
        
        const user= await userModel.create({name,email,password});
        const token=user.createJWT();
         res.status(200).send({success:true,message:"User Creatd SuccessFully",user,token})
        

    

}

export const loginController= async(req,res,next)=>{
    const {email,password}=req.body;
    if (!email||!password){
        next("All Fields are mandatory");
    }
    const user= await userModel.findOne({email});
    if(!user){
        next("Did not find any user")
    }
    const isMatch= await user.comparePassword(password);
    if(!isMatch){
        next("Invalid Password");
    }
    const token =user.createJWT();
    res.status(200).json({
        success:true,
        message:"Login Successfully",
        user,
        token
    })
};