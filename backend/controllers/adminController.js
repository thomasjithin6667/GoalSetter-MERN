const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')



  //function for admin login
  const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body
  
    // Check for user email
    const user = await User.findOne({ email })
 
    if (user && user.isAdmin && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        profileUrl:user.profileUrl,
        token: generateToken(user._id),
      
      })
    } else {
      res.status(400)
      throw new Error('Not Authorized')
    }
  })

const adminAccount= asyncHandler(
    async(req,res)=> {
        res.json({message:'Admin And user data'})
    }

)

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ isAdmin: false });

  if (users) {
    res.status(200).json({ users });
  } else {
    res.status(404);
    throw new Error("Users Not Found");
  }
});



//block and unblock users
const userBlock = asyncHandler(async (req, res) => {
  const userId = req.body.userId;
  const user = await User.findById(userId);

  if (!user) {
      res.status(400);
      throw new Error('User not found');
  }
  user.isBlock = !user.isBlock;
  await user.save();
  const users = await User.find({ isAdmin: false });
  res.status(200).json({ users });
});

//edit user
const editUser=asyncHandler(async(req,res)=>{
  const {userId,name,email}=req.body
  const updateUser=await User.findByIdAndUpdate(userId,{name,email},{new:true})
  const users=await User.find({ isAdmin: false })
  if(users){
      res.status(200).json({users})
  }else{
      res.status(404)
      throw new Error('User not Found')
  }
})

//search user
const searchUser=asyncHandler(async(req,res)=>{
 
  const {query}=req.body
  const regex=new RegExp(`^${query}`, 'i');

  const users = await User.find({name:{$regex:regex}})
  res.status(200).json({users});
})


// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}



module.exports={
  
    loginAdmin,
    adminAccount,
    getUsers,
    editUser,
    userBlock,
    searchUser
    
   }