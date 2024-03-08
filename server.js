import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import "express-async-errors"
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import test_Router from "./routes/test_Router.js";
import authRoute from "./routes/authRoute.js";
import errorMiddelware from "./middelware/errorMiddelware.js";
import userRoute from "./routes/userRoute.js";
import helmet from "helmet";
import xss from "xss-clean";
import jobRoute from "./routes/jobRoute.js";
import mongoSanitize from "express-mongo-sanitize";
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "swagger-jsdoc";

dotenv.config();
connectDB();
const options={
    definition: {
        openapi: "3.0.0",
        info: {
          title: "Job Portal Application",
          description: "Node Expressjs Job Portal Application",
        },
        servers: [
          {
            url: "http://localhost:8080",
                // url: "https://nodejs-job-portal-app.onrender.com"
          },
        ],
      },
      apis: ["./routes/*.js"],
};
const spec=swaggerDoc(options);



const app=express()
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/api/v1/test",test_Router);
app.use("/api/v1/auth",authRoute);
app.use("/api/v1/user",userRoute);
app.use("/api/v1/job",jobRoute);

app.use("/api-doc",swaggerUi.serve,swaggerUi.setup(spec))
app.use(errorMiddelware);

app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
const PORT=process.env.PORT||8680;

app.listen(PORT,()=>{
    console.log(`server is ${PORT} ,${process.env.DEV_MODE} running`.bgBlue);
});