export const TestPostController=(req,res)=>{
    const {name}=req.body;
    res.status(200).send(`This is ${name}`)
};