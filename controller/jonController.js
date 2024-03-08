import mongoose from "mongoose";
import jobmodel from "../models/jobmodel.js";
import moment from "moment";

export const jonController=async(req,res,next)=>{
   const {company, position}=req.body;
   if(!company || !position){
    next("please provide all the fields");
   }
   req.body.createdBy=req.user.userId;
   const job=await jobmodel.create(req.body);
   res.status(200).json({job});

}
export const getjobController =async(req,res,next)=>{

    const {status,workType,search,sort}=req.query;
    const queryObject={
        createdBy:req.user.userId
    }
    if(status && status!=="all"){
        queryObject.status=status
    }
    if (workType && workType!=="all"){
        queryObject.workType=workType
    }
    if (search){
        queryObject.position={$regex:search,$options:"i"};
    }
    let queryResult=jobmodel.find(queryObject);
    if(sort==="latest"){
        queryResult=queryResult.sort("-createdAt");
    }
    if(sort==="oldest"){
        queryResult=queryResult.sort("createdAt");
    }
    if(sort==="a-z"){
        queryResult=queryResult.sort("position");
    }
    if(sort==="A-Z"){
        queryResult=queryResult.sort("-position");
    }


    const page =Number(req.query.page)||1;
    const limit=Number(req.query.limit)||10;
    const skip=(page-1)*limit;
    queryResult=queryResult.skip(skip).limit(limit);
    const totalJobs=await jobmodel.countDocuments(queryResult)
    const numOfPage=Math.ceil(totalJobs/limit)
    const jobs =await queryResult;
    if(jobs){
        res.status(200).json({
            totalJobs,
            jobs,
            numOfPage,
            
        })
    }
}

export const updatejobController = async (req,res,next)=>{
    const {id}=req.params;
    const {company,position}=req.body;
    if(!company || !position){
        next("Al fields are required");
    }
    const job= await jobmodel.findOne({_id:id});
    if(!job){
        next("we did not find any jon with that id");

    }
    if(!req.user.userId==job.createdBy.toString()){
        next("You are not authorized");
        return ;
        

    }
    const updatejob= await jobmodel.findByIdAndUpdate({_id:id},req.body,{
        new:true,
        runValidators:true
    });
    res.status(200).send(updatejob);
}

export const deletejobController = async (req,res,next)=>{
    const {id}=req.params;
    
    
    const job= await jobmodel.findOne({_id:id});
    if(!job){
        next("we did not find any jon with that id");

    }
    if(!req.user.userId==job.createdBy.toString()){
        next("You are not authorized");
        return ;
    }
    await job.deleteOne();
    res.status(200).send({job});
}
export const jobstatController=async (req,res,next)=>{
    const stats= await jobmodel.aggregate([{

        $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId),
        },
    },
    {
        $group:{
           _id:"$status",
           count:{$sum :1},
        }
    }
    ]

    )

    let monthlytime= await jobmodel.aggregate([{

        $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId),
        },
    },
    {
        $group:{_id:{
           month:{$month:"$createdAt"},
           year:{$year:"$createdAt"},
           
        },
        count:{$sum :1},
        },
    },
    ]

    )
    monthlytime = monthlytime.map((item)=>{
        const {_id: {year,month},
    count}=item;
    const date=moment().month(month-1).year(year).format("MMM Y");
    return {date,count}
    })

    
    const defaultstat= {
        pending : stats.pending||0,
        reject : stats.reject||0,
        interview : stats.interview||0,
        
    };
    res.status(200).json({statsCount:stats.length,stats,totaljobatT:monthlytime.length,monthlytime})
};