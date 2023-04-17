const express = require("express")
const mongoose = require("mongoose")
var cookie = require('cookie-parser')
const {connection} = require("./config/db")
const {userRoutes} = require("./routes/user.routes")
const cookieParser = require("cookie-parser")
require("dotenv").config()
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use("/",userRoutes)

app.listen(process.env.PORT,async()=>{
    try {
        await connection 
        console.log(`Connected to database through port ${process.env.PORT}`)
    } catch (error) {
        console.log(error)
    }
    console.log("Listening to server")
})