const jsw = require('jsonwebtoken')

exports.genToken=(req,res)=>{
    const option ={
        id:req.genPass.id,
        role: req.genPass.role,
        time:Date.now()
    }

    const token = jsw.sign(option,process.env.SECRETKEY,{expiresIn:'1d'})
    if(!token){
        return res.status(401).json({
         success:false,
         message:"inValid token"
        })
      }
     
       res.status(200).cookie("token",token).json({
         success:true,
         message:"your are login successfully",
         user:req.genPass,
         athetication:true,
         token
     })
}
