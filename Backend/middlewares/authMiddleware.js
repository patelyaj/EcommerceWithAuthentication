import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';

configDotenv();

export const verifyToken = async(req,res,next)=>{
   try {
    console.log("Cookies:", req.cookies);

     const token = req.cookies.jwt;
 

     if(!token){
         return res.status(401).json({
             error :"Nottt authorized"
         });
     }

     console.log('first')
 
     const decode = jwt.verify(token,process.env.JWT_SECRET);
 
     console.log(decode);
  // Attach user to request (important for later)
    req.user = decode;

    console.log("Token verified:", decode);

    // ✅ Continue to controller
    next();

    // next()
   } catch (error) {
    console.log("error in verify token api")
    return res.status(401).json({
             error :"Nottt authorized"
         });
   }

}