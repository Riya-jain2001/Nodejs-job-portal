import mongoose from "mongoose";
import colors from "colors";
const connectDB= async ()=>{
    try{
        const conn= await mongoose.connect(process.env.MONGO_URL);
        console.log(`DataBase is Connected at ${mongoose.connection.host}`.bgCyan);
    }catch(error){
        console.log(error);
    }
}
export default connectDB;