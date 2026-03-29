import User from '../model/user.model.js'
import jwt from 'jsonwebtoken'
import { sendWelcomeEmail, sendEmailChangeVerification, sendEmailChangedConfirmation, sendVerificationEmail, sendAccountVerifiedEmail } from '../emailService/email.js'
import { generateToken, generateTokenAndSetCookie } from "../utils/generateToken.js"
//import crypto from 'crypto'
import axios from 'axios'
import { OAuth2Client } from 'google-auth-library'
import bcrypt from 'bcryptjs'
import cloudinary from '../utils/cloudinary.js'
import { redis } from '../utils/redis.js'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

//const link = process.env.NODE_ENV === "development" ? process.env.EXPO_LINK : process.env.APP_LINK

export const signup = async(req, res) =>{
  
  const { name, email, password } = req.body
  
  try {
    
    if(!name || !email || !password){

    return res.status(400).json({ success: false, message: "All fields are required" })
    }

    if(password.length < 6){
      return res.status(400).json({ success: false, message: "Password must be atleast 6 characters" })
    }

    const userExist = await User.findOne({email})
    if(userExist){
      return res.status(400).json({ success: false, message: "User already exist" })
    }

    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()
    
    const user = new User({
      name,
      email,
      password,
      verificationToken,
    })


    await user.save()

    //jwt authenticate user
    //generateTokenAndSetCookie(res, user._id, user.tokenVersion)
    
    await sendWelcomeEmail(user.email, user.name)
    
    
    console.log("User created successfully")
    
    res.status(201).json({ 
        success: true,
        message: "User created successfully",
       
    })
    
  } catch (error) {
    console.error("Error in signup contoller", error.message);
    res.json({ 
      success: false,
      message: error.message
    })
  }
  
  
}

export const login = async(req, res) =>{
  
  const { email, password } = req.body
  
  try {
    const user = await User.findOne({ email })
  
    if(user && (await user.comparePassword(password))) {
      
      generateTokenAndSetCookie(res, user._id, user.tokenVersion)
    
      user.lastLogin = new Date()
    
      await user.save()
        
      console.log("User login successfully")

      const userInfo = {
        id: user._id,
        email: user.email,
        name: user.name,
        lastLogin: user.lastLogin,
        image: user.image,
        pendingEmail: user.pendingEmail,
        isVerified: user.isVerified,
        createdAt: user.createdAt
      }
    
      res.status(200).json(userInfo)

    } else {
      throw new Error("Incorrect email or password")
    }
  } catch (error) {
    console.error("Error in login contoller", error.message);
    res.status(400).json({ 
      success: false,
      message: error.message
    })
  }
}


export const getUser = async(req, res) =>{
  

  
  try {
    const user = await User.findById(req.user._id).select("-password")

    if(!user){
      res.status(404).json({ success: false, message: "User not found"})
    }

    const userInfo = {
      id: user._id,
      email: user.email,
      name: user.name,
      lastLogin: user.lastLogin,
      image: user.image,
      pendingEmail: user.pendingEmail,
      isVerified: user.isVerified,
      createdAt: user.createdAt
    }
  
    res.status(200).json(userInfo)


  } catch (error) {
    console.error("Error in get user contoller", error.message);
    res.status(500).json({ 
      success: false,
      message: error.message
    })
  }
}

export const logoutUser = async (req, res) =>{

  try {

    const user = req.user

    await User.findByIdAndUpdate(user._id, {
      $inc: { tokenVersion: 1 }
    })
    res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",

    })

    console.log("toknver", user.tokenVersion)
    console.log("User logout successfully")
    
    res.status(200).json({success: true, message: "User logout successfully"})
  } catch (error) {
    console.error("Error in logout contoller", error.message);
    res.status(500).json({ 
      success: false,
      message: error.message
    })
  }
  
}


export const authGoogle = async (req, res) => {
  
  const authUri = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent('profile email')}`

  res.redirect(authUri)
}


export const callback = async (req, res) => {
  console.log(req.query)

  const code = req.query.code
  console.log(code)
  
  try {

    const googleRes = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code: req.query.code,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code'
    })
    console.log("callback successful")
    //console.log("googleRes.data", googleRes.data)

    const { id_token, access_token } = googleRes.data

    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()

    //console.log("payload", payload)

    const { email, name, sub: googleId } = payload

    // check if user is already created

    let user = await User.findOne({ email })

    if (!user) {
      user = await User.create({
        email,
        name,
        googleId,
        

      })

      await sendWelcomeEmail(user.email, user.name)

      
    } 

  
    user.isVerified = true
    user.lastLogin =  new Date()
  
    await user.save()

    const code = Math.floor(100000 + Math.random() * 900000).toString()


    const hashedcode = await bcrypt.hash(code, 10)
    console.log("code", hashedcode)
    const id = user._id.toString()

    await redis.set(`auth_code: ${hashedcode}`, id, { ex: 60 }) //expires in 60 seconds
   
   
  
    const redirect_uri = `wallet//(auth)/callback?code=${hashedcode}` 
    
    res.redirect(redirect_uri)
    
    
    
  } catch (error) {

    console.log(error)
  
    const redirect_uri =  `wallet//(auth)/login`//wallet://(auth)/login`
    res.redirect(redirect_uri)
  }
}


export const verifyAuthCode = async (req, res) => {

  const { code } = req.body

  console.log("auth-code", code)

  if(!code){
    return res.status(400).json({ error: "no code provided" })
  }

  try {

    const hashedcode = code
    const key = `auth_code: ${hashedcode}`

    const userId = await redis.get(key)

    if(!userId) {
      return res.status(400).json({ message: "Invalid or expired code" })
    }


    //delete key
    await redis.del(key)

    const user = await User.findById(userId)
    generateTokenAndSetCookie(res, user._id, user.tokenVersion)

    const userInfo = {
      id: user._id,
      email: user.email,
      name: user.name,
      lastLogin: user.lastLogin,
      image: user.image,
      pendingEmail: user.pendingEmail,
      isVerified: user.isVerified,
      createdAt: user.createdAt
    }
  
    res.status(200).json(userInfo)


  } catch (error) {
    console.error("Error in verify auth code contoller", error.message);
    res.status(400).json({ 
      success: false,
      message: error.message
    })
  }
  
}

export const changeEmail = async(req, res) =>{
  try {

  
    const { newEmail, password } = req.body

    const user = await User.findById(req.user._id)

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
      return res.status(400).json({ success: false, message: "Invalid password" })
    }

    
    const emailExist = await User.findOne({
      $or: [{ email: newEmail }, { pendingEmail: newEmail }],
    })

    if(emailExist){
      return res.status(400).json({ success: false, message: "Email already exist" })
    }

    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()

    user.pendingEmail = newEmail
    user.verificationToken = await bcrypt.hash(verificationToken, 10)
    user.verificationTokenExpiresAt = Date.now() + 15  * 60 * 1000  //15 mins

    await user.save()

    const code = verificationToken

    
    
    

     try {
      await sendEmailChangeVerification(user.email, user.name, code, newEmail)
    } catch (error) {
      res.status(500).json({ message: error.message || "error sending verification email"})
    }

    res.json({ message: "Email change verificatin sent"})

  } catch (error) {
    console.error("Error in change email contoller", error.message);
    res.json({ 
      success: false,
      message: error.message
    })
  }
}

export const verifyNewEmail = async(req, res) =>{
  try {
    const { code } = req.body

    const user = await User.findById(req.user._id)
    

    if (!user.pendingEmail || !user.verificationToken){
      return res.status(400).json({ success: false, message: "No pending email change" })
    }

    if(Date.now() > user.verificationTokenExpiresAt){
      return res.status(400).json({ success: false, message: "OTP code expired" })
    }

    const validCode = await bcrypt.compare(code, user.verificationToken)

    if(!validCode){
      return res.status(400).json({ success: false, message: "Invalid OTP code" })
    }


    const oldEmail = user.email

    const newEmail = user.pendingEmail


    user.email = newEmail
    user.pendingEmail = null
    user.verificationToken = null
    user.verificationTokenExpiresAt = null
    user.isVerified = true

    user.tokenVersion += 1

    await user.save()

    const date = new Date()


    //send email update message

    await sendEmailChangedConfirmation(oldEmail, user.name, newEmail, date)

    res.json({ message: "Email updated successfully"})
  } catch (error) {
    console.error("Error in  email change confirm contoller", error.message);
    res.json({ 
      success: false,
      message: error.message
    })
  }
}

export const deleteAccount = async(req, res) =>{
  try {

    const user = req.user
    if(user.image){
      const publicId = product.image.split("/").pop().split(".")[0]
      
      try {
        await cloudinary.uploader.destroy(`wallet/${publicId}`)
        console.log("user image deleted from cloudinary")
      } catch (error) {
        console.error("error deleting user image from cloudinary", error);
      }
    }

    await User.findOneAndDelete(req.user._id)


    console.log("user deleted")
    res.json({ message: " user deleted successfully"})
  } catch (error) {
    console.error("Error in  deleteAccount contoller", error.message);
    res.json({ 
      success: false,
      message: error.message
    })
  }
}

export const changeName = async(req, res) =>{
  try {
    
    const { name } = req.body
    const user = await User.findById(req.user._id).select("-password")
    if(!user){
      res.status(404).json({ success: false, message: "User not found"})
    }

    user.name = name

    await user.save()

    res.json(user)


  } catch (error) {
    console.error("Error in  changeName contoller", error.message);
    res.json({ 
      success: false,
      message: error.message
    })
  }
}

export const changePassword = async(req, res) =>{

  try {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user._id)

    if(!user){
      res.status(404).json({ success: false, message: "User not found"})
    }

    const isPasswordcorrect = await bcrypt.compare(oldPassword, user.password)

    if(!isPasswordcorrect){
      return res.status(400).json({ success: false, message: "Incorrect old password" })
    }

    user.password = newPassword

    user.tokenVersion += 1

    await user.save()

    res.json({ message: "password changed successfully"})



  } catch (error) {
    console.error("Error in  chnagepassword contoller", error.message);
    res.json({ 
      success: false,
      message: error.message
    })
  }

}

export const changePic = async(req, res) =>{
  try {
    const { data } = req.body

    const user = await User.findById(req.user._id).select("-password")

    let cloudinaryResponse = null

    if(data){

      if(user.image){
        const publicId = user.image.split("/").pop().split(".")[0]
        
        try {
          await cloudinary.uploader.destroy(`wallet/${publicId}`)
          console.log("product previous image deleted from cloudinary")
        } catch (error) {
          console.error("error deleting previous image from cloudinary", error);
        }
      }

      cloudinaryResponse = await cloudinary.uploader.upload(data, { folder: "wallet" })

    }

    user.image = cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : ""

    await user.save()

    res.json(user)


  } catch (error) {
    console.error("Error in  changepic contoller", error.message);
    res.json({ 
      success: false,
      message: error.message
    })
  }
}



export const verifyAccount = async(req, res) =>{


  try {

    const user = await User.findById(req.user._id)

    if(!user){
      res.status(404).json({ success: false, message: "User not found"})
    }

    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()

    console.log(verificationToken)

    
    user.verificationToken = await bcrypt.hash(verificationToken, 10)
    user.verificationTokenExpiresAt = Date.now() + 15  * 60 * 1000  //15 mins
    
    await user.save()

    const code = verificationToken

    
    /* try {
      await sendVerificationEmail(user.email, user.name, code)
    } catch (error) {
      res.status(500).json({ success: false, message: error.message || "error sending verification email"})
    } */
    
    await sendVerificationEmail(user.email, user.name, code)

    res.status(200).json({ success: true, message: "verification email sent"})

    
  } catch (error) {
    console.error("Error in  verifyAccount contoller", error.message);
    res.json({ 
      success: false,
      message: error.message
    })
    
  }
}

export const verifyCode = async(req, res) =>{
  try {
   const { code } = req.body

   const user = await User.findById(req.user._id)

   if(Date.now() > user.verificationTokenExpiresAt){
      return res.status(400).json({ success: false, message: "OTP code expired" })
    }

    const validCode = await bcrypt.compare(code, user.verificationToken)

    if(!validCode){
      return res.status(400).json({ success: false, message: "Invalid OTP code" })
    }

    user.verificationToken = null
    user.verificationTokenExpiresAt = null
    user.isVerified = true

    user.tokenVersion += 1

    await user.save()

    await sendAccountVerifiedEmail(user.name, user.email)

    res.json(user)

    

  } catch (error) {
    console.error("Error in  verifycode contoller", error.message);
    res.json({ 
      success: false,
      message: error.message
    })
  }
}

export const resendCode = async(req, res) =>{


  try {
    const user = await User.findById(req.user._id)

    const newCode = Math.floor(100000 + Math.random() * 900000).toString()

    console.log(newCode)

    
    user.verificationToken = await bcrypt.hash(newCode, 10)
    user.verificationTokenExpiresAt = Date.now() + 15  * 60 * 1000  //15 mins
    
    await user.save()

    const code = newCode

    /* try {
      await sendVerificationEmail(user.email, user.name, code)
    } catch (error) {
      res.status(500).json({ success: false, message: error.message || "error sending verification email"})
    } */
    
    await sendVerificationEmail(user.email, user.name, code)

    res.status(200).json({ success: true, message: "verification email resent"})
    
  } catch (error) {
    console.error("Error in  resend code contoller", error.message);
    res.json({ 
      success: false,
      message: error.message
    })
  }
}