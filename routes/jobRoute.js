import express from "express";
import userAuth from './../middelware/authmiddleware.js';
import { deletejobController, getjobController, jobstatController, jonController, updatejobController } from "../controller/jonController.js";

const router = express.Router();
/**
 * @swagger
 * components:
 *  schemas:
 *    Jobs:
 *      type: object
 *      required:
 *        - company
 *        - position
 *        
 *      properties:
 *        id:
 *          type: string
 *          description: The Auto-generated id of user collection
 *          example : DHSASDHJDJHVAJDSVJAVSD
 *        company:
 *          type: string
 *          description: the name of the company
 *        position:
 *          type: string
 *          description: position of the job that applied for
 *        status:
 *          type: string
 *          description: status of the application
 *        workType:
 *          type: string
 *          description: type of the job that it is internship or fulltime
 *        location:
 *          type: string
 *          description: user location city or country
 *        createdBy:
 *          
 *          description: who created this job
 *      example:
 *        id: GDHJGD788BJBJ
 *        company: John
 *        position: HR
 *        status: pending
 *        workType: part-time
 *        location: mumbai
 *        createdBy: GDHJGD788BJBJ
 */
 /**
 *  @swagger
 *  tags:
 *    name: Jobs
 *    description:  Jobs Apis
 */

/**
 * @swagger
 * /api/v1/job/create-job:
 *    post:
 *      summary: create new job
 *      tags: [Jobs]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Jobs'
 *      responses:
 *        200:
 *          description: job created successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Jobs'
 *        500:
 *          description: internal serevr error
 */

router.post("/create-job",userAuth,jonController);

router.get("/get-jobs",userAuth,getjobController);
router.patch("/update-job/:id",userAuth,updatejobController);
router.delete("/delete-job/:id",userAuth,deletejobController);
router.get("/job-stat",userAuth,jobstatController);


export default router;