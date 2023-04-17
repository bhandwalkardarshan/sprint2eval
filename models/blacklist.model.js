const mongoose = require("mongoose")

const blacklistSchema = mongoose.Schema({
    token:{type:String,required:true}
})

const BlacklistModel = mongoose.model("Blacklist",blacklistSchema)
module.exports = {BlacklistModel}