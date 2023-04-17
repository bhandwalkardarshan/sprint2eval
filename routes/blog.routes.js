/*
CRUD Operations

An authenticated user should be able to create a blog
All authenticated users should be able to read all blogs
Establish relationship so that an authenticated user should be able to update or delete only their blog.
An authenticated moderator should be able to remove/delete any blog. */

const mongoose = require("mongoose")
const express = require("express")
const {UserModel} = require("../models/user.model")
const {BlogModel} = require("../models/blog.model")
const {authentication} = require("../middlewares/authentication")
const {authorization} = require("../middlewares/authorization")
const blogRoutes = express.Router()

// create blog
blogRoutes.post('/create',authentication, async(req, res)=>{
    try {
        const blog = new BlogModel(req.body)
        await blog.save()
        res.status(200).send("New blog added")
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

// read blog
blogRoutes.get('/read', authentication,async(req, res)=>{
    try {
        const blogs = await BlogModel.find()
        res.send(blogs)
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

// update blog
blogRoutes.post('/update/:_id',authentication,authorization(["Moderator"]), async(req, res)=>{
    try {
        const payload = req.body
        const blog = await BlogModel.findByIdAndUpdate(req.params,payload)
        res.status(200).send({message: "Blog updated",blog: blog})
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

// delete blog
blogRoutes.post('/delete/:_id',authentication,authorization(["Moderator"]), async(req, res)=>{
    try {
        const blog = await BlogModel.findByIdAndDelete(req.params)
        res.status(200).send({message: "Blog deleted"})
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})


module.exports = {
    blogRoutes
}