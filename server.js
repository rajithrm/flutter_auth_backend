require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/userModel")

app.use (express.json());

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch((err)=>console.log(err));

app.get("/", (req,res)=>{
    res.send("Api is running....");
});

app.post("/api/signup", async (req,res) => {
    try {
        const { name, email, password } = req.body;

        
        const userExists = await User.findOne ({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        
        const user = await User.create({
            name,
            email,
            password,
        });

        res.status(201).json({
            message: "User created successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
});