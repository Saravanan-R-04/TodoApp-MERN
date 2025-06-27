import express from "express";
import { connectDB } from "./db.js";
import { userModel } from "./userModel.js";
import cors from 'cors'
const PORT=5500;
const app=express();
await connectDB();
app.use(cors())
app.post('/todo',express.json(),async (req,res)=>{
    const{title,description}=req.body;
    const newUser=userModel({
        title,
        description
    });
    await newUser.save();
    res.status(200).send("Data Inserted Successfully")
})

app.get('/todo',async(req,res)=>{
    const todos=await userModel.find();
    res.status(200).json(todos)
})

app.put('/todo/:id',express.json(),async(req,res)=>{
    const userId=req.params.id;
    const{title,description}=req.body;
    const updatedList=await userModel.findByIdAndUpdate(
        userId,
        {title,description},
        {new:true}
    )
    res.status(200).send("Data Updated");
})

app.delete('/todo/:id',async(req,res)=>{
    const userId=req.params.id;
    await userModel.findByIdAndDelete(userId);
    res.status(200).send("Data Deleted Successfully") 
})

app.listen(PORT,()=>{
    console.log(`Server Running on PORT:${PORT}`);
})