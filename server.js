require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use (express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch((err)=>console.log(err));

app.get("/", (req,res)=>{
    res.send("Api is running....");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
});