const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')


// register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('Email already registered');
  }


  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);


  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      profileUrl: user.profileUrl,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

  //login
  const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
  

    const user = await User.findOne({ email })
  
    if (user) {
      if (user.isBlock) {
        res.status(400)
        throw new Error('User is blocked')
      }

      if (await bcrypt.compare(password, user.password)) {
        res.json({
          _id: user.id,
          name: user.name,
          email: user.email,
          profileUrl: user.profileUrl,
          token: generateToken(user._id),
        })
      } else {
        res.status(400)
        throw new Error('Invalid credentials')
      }
    } else {
      res.status(400)
      throw new Error('User not found')
    }
  })

  //account
const userAccount=asyncHandler(async(req,res)=>{
  res.status(200).json(req.user)
    }
    
)

//edit user
const editUser=asyncHandler(async(req,res)=>{
  const {userId,name,email}=req.body
  const user=await User.findByIdAndUpdate(userId,{name,email},{new:true})
 
  if(user){
      res.status(200).json({user})
  }else{
      res.status(404)
      throw new Error('User not Found')
  }
})


// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    })
  }

//photo url upload
const profileUpload = asyncHandler(async (req, res) => {
  const url = req.body.url;

  const user = await User.findByIdAndUpdate(req.user.id, {
    profileUrl: url
  }, { new: true });

  
  res.status(200).json(user.profileUrl);
});

  

module.exports={
 registerUser,
 loginUser,
 userAccount,
 editUser,
 profileUpload
}