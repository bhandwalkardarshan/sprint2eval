const jwt = require("jsonwebtoken")
const {BlacklistModel} = require("../models/blacklist.model")
const {UserModel} = require("../models/user.model")

const authentiacation = async (req,res,next) => {
    try {
        const accessToken = req.cookies.access_token
    const isTokenBlacklisted = await BlacklistModel.findOne({token:accessToken})
    if(isTokenBlacklisted){
        return res.send({message:"You are logged out please login again"})
    }

    if(accessToken){
        jwt.verify(accessToken,"jwtkeyforaccesstoken",async(err,decode)=>{
            if(decode){
                const id = decode.userID
                const user = await UserModel.findOne({_id:id})
                const role = user.role
                req.role = role

                next()
            }
            else {
                res.send({message:"Please login first"})
            }
        })
    }
    else{
        res.send({message:"Please login"})
    }
    } catch (error) {
        res.send(error.message)
    }
    
}

module.exports={authentiacation}