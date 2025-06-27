import mongoose from "mongoose";
export const connectDB = async()=>{
    const MONGD_URI="mongodb://localhost:27017/TodoApp"
    await mongoose.connect(MONGD_URI).then(()=>{
        console.log("DB CONNECTED")
    })
}