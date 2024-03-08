import express from "express";
import userAuth from "../middelware/authmiddleware.js";
import { updateController } from "../controller/userController.js";
const router = express.Router();
router.put("/update-user",userAuth,updateController)
export default router;