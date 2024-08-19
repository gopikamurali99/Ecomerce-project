const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/AuthModel'); 
const AuthModel = require('../models/AuthModel');
const router = express.Router();

router.post('/register',async(req,res)=>{
    const {name,email,password,role}=req.body;
    try{
        //checking whether the user is already existing or not
        const existingUser = await AuthModel.findOne({ email });
        if(existingUser)
            {
            return res.status(400).json({message:'User already exist'});
            }

            const hashedPassword =await bcrypt.hash(password,10);
             
            const newUser = new User({
                name,
                email,
                password:hashedPassword,
                role
            });
             await newUser.save();
             res.status(201).json({message:'user registerd successfully'});
        

       }
       catch(error){
        res.status(201).json({message:'user registered successfully'});

       }
    })

       //signIn

       router.post('/login', async(req,res)=>{
        const{ email, password}=req.body; 

        try{
            //checking the user existing or not
            const user = await AuthModel.findOne({email});
            if(!user){
                return res.status(400).json({message:'user not found'})

            }
            //comparing the password is matching with the hashed password provided above
             const passwordMatch = await bcrypt.compare(password,user.password);
             if(!passwordMatch){
                return res.status(400).json({message:'invalid credentials'})
             }
             const token = jwt.sign({ id: user._id, role: user.role }, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c', { expiresIn: '1h' });
             res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
        }
        catch(error){

            res.status(500).json({ error: error.message });
        }

       })

       module.exports = router;
       
