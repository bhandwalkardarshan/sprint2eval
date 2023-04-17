const mongoose = require("mongoose")

const blogSchema = mongoose.Schema({
    blogname:{type:String,required:true},
    desc:{type:String,required:true}
})

const BlogModel = mongoose.model("Blogs",blogSchema)
module.exports = {BlogModel}