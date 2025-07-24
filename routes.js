const express = require('express')
const router = express.Router();
const user = require('../models/user');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');

//register
router.post('/users', async (req, res)=>{
    try{
        const existinguser = await user.findOne({name : req.body.name});
        if(existinguser) return res.status(400).send({message : "User already exists"});

        //hash the password before saving
        const hashedpassword = await bcrypt.hash(req.body.password, 10);
        const newuser = new user({
            name: req.body.name,
            email: req.body.email,
            password: hashedpassword
        });

        const saved = await newuser.save();
        res.status(200).json(saved);
    }
    catch(error){
        res.status(500).json({message : "Internal Server Error"});
    }
});

//login

router.post('/login', async (req, res)=>{
    const {name, password} = req.body;
    try{
        const existinguser = await user.findOne({name});
        if(!existinguser) return res.status(404).json({message:'user not found'});

        const ismatch = await bcrypt.compare(password, existinguser.password);
        if(!ismatch) return res.status(400).json({message : "Invalid Credentials"});
        const token = jwt.sign({userId: existinguser._id}, process.env.JWT_SECRET, {expiresIn : '1h'});
        res.json({message :'login succesful', token, user: existinguser});

        }
        catch(err){
            res.status(500).json({message: err.message});
        }

    
})
module.exports= router;