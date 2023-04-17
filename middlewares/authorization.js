
const authorization = (permittedRole) => {
    return (req,res,next)=>{
        const userRole = req.role

        if(permittedRole.includes(userRole)){
            next()
        }
        else {
            return res.send({message:"Unauthorized"})
        }
    }
}

module.exports={authorization}