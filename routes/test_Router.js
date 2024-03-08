import express from 'express';
import {TestPostController} from "../controller/TestJobPortal.js";
import userAuth from '../middelware/authmiddleware.js';
const router= express.Router();
router.post('/test-post',userAuth,TestPostController);

export default router;