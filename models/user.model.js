const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    role:{type:String,required:true,enum:["User","Moderator"],default:"User"}
})

const UserModel = mongoose.model("User",userSchema)
module.exports = {UserModel}