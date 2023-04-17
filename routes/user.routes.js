const mongoose = require("mongoose")
const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {UserModel} = require("../models/user.model")
const {blacklistModel} = require("../models/blacklist.model")
const userRoutes = express.Router()

// signup
userRoutes.post("/signup",async(req,res)=>{
    try {
        const {name,email,password,role}=req.body
        // check user id present or not
        const user = await UserModel.findOne({email})
        if(user){
            return res.status(400).send({message:"User already exists please login"})
        }
        // hash password
        const hashedPassword = bcrypt.hashSync(password,8)
        const newUser = new UserModel({name,email,password:hashedPassword,role})
        await newUser.save()

    res.status(200).send({message:"User registered Successfully",user:newUser})
    } catch (error) {
        res.status(400).send({message:error.message})
    }
})

// login
userRoutes.post("/login",async(req,res)=>{
    try {
        const {email,password} = req.body
         // check user id present or not
         const user = await UserModel.findOne({email})
         if(!user){
             return res.status(400).send({message:"Not a user. Please signup"})
         }

        //  check passwords
        const isPasswordMatch = bcrypt.compareSync(password, user.password)
        if(!isPasswordMatch){
            return res.status(400).send({message:"Wrong Credentials"})
        }

        // create tokens
        const accessToken = jwt.sign({ email,role:user.role }, "jwtkeyforaccesstoken", { expiresIn:'1m' })
        const refreshToken = jwt.sign({ email,role:user.role }, "jwtkeyforrefreshtoken", { expiresIn: '3m' })

        res.cookie("access_token", accessToken,{maxAge:1000*45})
        res.cookie("refresh", refreshToken,{maxAge:1000*60*2})

        res.status(200).send({message:"Login Successful"})

    } catch (error) {
        res.status(400).send({message:error.message})
    }
})

// logout
userRoutes.get("/logout",async(req,res)=>{
    try {
        const accessToken = req.cookies.access_token
        const blacklistAccessToken = new BlacklistModel({token:accessToken})
        await blacklistAccessToken.save()

        res.clearCookie("access_token")
        res.status(200).send({message:"Logged out successfully"})
    } catch (error) {
        res.status(400).send({message:error.message})
    }
})

// refresh token
userRoutes.get("/refresh",async(req,res)=>{
    try {
        const {refreshToken} = req.cookies
        const decoded = jwt.verify(refreshToken,"jwtkeyforrefreshtoken")
        if(decoded){
            const accessToken = jwt.sign({userID:decoded.userID},"jwtkeyforaccesstoken",{expiresIn:'1m'})
            res.cookie("access_token",accessToken,{maxAge:1000*45})
            return res.send(accessToken)
        }
        else{
            res.send({message:"Invalid refresh token please login again"})
        }
    } catch (error) {
        res.status(400).send({message:error.message})
    }
})


module.exports = {userRoutes}