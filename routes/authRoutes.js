const router = require("express").Router();
const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async(req,res)=>{

    try{

        const {username,email,password} = req.body;

        const existing = await User.findOne({email});

        if(existing){
            return res.status(400).json({
                message:"Email already exists"
            });
        }

        const hashed = await bcrypt.hash(password,10);

        const user = await User.create({

            username,
            email,
            password:hashed

        });

        res.json(user);

    }catch(err){

        res.status(500).json(err);

    }

});

router.post("/login", async(req,res)=>{

    try{

        const {email,password} = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                message:"User not found"
            });
        }

        const valid = await bcrypt.compare(password,user.password);

        if(!valid){
            return res.status(400).json({
                message:"Wrong password"
            });
        }

        const token = jwt.sign({

            id:user._id

        },process.env.JWT_SECRET);

        res.json({
            token,
            user
        });

    }catch(err){

        res.status(500).json(err);

    }

});

module.exports = router;
