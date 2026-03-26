require("dotenv").config();
const bcrypt = require("bcryptjs");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/userModel")
const jwt = require("jsonwebtoken");

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

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            message: "User created successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

app.post("/api/login", async (req,res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        //create token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login Successful",
            token,
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