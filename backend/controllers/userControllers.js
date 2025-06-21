const User = require('../models/user')
const Comment = require('../models/comment')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const getDataUri = require('../utils/datauri')
const cloudinary = require('../utils/cloudinary')
require('dotenv').config()

const Post = require('../models/post')

module.exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if(!username || !email || !password) {
            return res.status(401).json({
                message: "Please fill in all fields",
                success: false
            })
        }
        
        const user = await User.findOne({ email });
        if(user) {
            return res.status(401).json({
                message: "User already exists",
                success: false
            })
        }

        await User.create({
            username,
            email,
            password: await bcrypt.hash(password, 10)
        })

        return res.status(200).json({
            message: "Account created successfully",
            success: true
        })


    }catch(err){
       console.log(err)
    }
}

module.exports.login = async (req, res) => {
    try{
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(401).json({
                message: "Please fill in all fields",
                success: false
            })
        }

        let user = await User.findOne({ email });
        if(!user) {
            return res.status(401).json({
                message: "Invalid email or password",
                success: false
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
                success: false
            })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        

        const post = await Post.find({author:user._id})

        user = {
            _id : user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            post
        }


        return res.cookie('token', token, {httpOnly:true, sameSite: 'strict' , maxAge: 1*24*60*60*1000}).status(200).json({
            message: "Logged in successfully",
            success: true,
            token,
            user
        });


    }
    catch(err){
        console.log(err)
    }
}

module.exports.logout = async (_, res) => {
    try{
        return res.clearCookie('token',{httpOnly:true, sameSite: 'strict'}).status(200).json({
            message: "Logged out successfully",
            success: true
        })
    }catch(err){
        console.log(err)
    }
}

module.exports.getProfile = async (req, res) => {
    try{
        const userId = req.params.id;
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }
        return res.status(200).json({
            message: "User profile retrieved successfully",
            success: true,
            user
        })
    }catch(err){
        console.log(err)
    }
}

module.exports.editProfile = async (req,res) => {
    try{
        const userId = req.id;
        const {bio, gender} = req.body;
        const profilePicture = req.file;
        let cloudinaryResponse;

        let user = await User.findById(userId);

        if(profilePicture){
            const fileUri = getDataUri(profilePicture);
            cloudinaryResponse = await cloudinary.uploader.upload(fileUri)
        }

        if(bio){
            user.bio = bio
        }

        if(gender){
            user.gender = gender
        }
        if(profilePicture){
            user.profilePicture = cloudinaryResponse.secure_url
        }

        await user.save();
        return res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            user
        })

    }catch(err){
        console.log(err)
    }
}

module.exports.getSuggestedUsers = async(req,res) => {
    try{
        const suggestedUsers = await User.find({id:{$ne:req.id}}).select("-password");
        if(!suggestedUsers){
            return res.status(404).json({
                message: "No users found",
                success: false
            })
        }

        return res.status(200).json({
            message: "Suggested users found",
            success: true,
            users: suggestedUsers
        })
    }
    catch(err){
        console.log(err)
    }
}

module.exports.followOrUnfollow = async (req,res) => {
    try{
        const followKarneWala = req.id;
        const jiskofollowKarnaHai = req.params.id;

        if(followKarneWala === jiskofollowKarnaHai){
            return res.status(400).json({
                message: "You can't follow yourself",
                success: false
            })
        }
        
        const user = await User.findById(followKarneWala);
        const target = await User.findById(jiskofollowKarnaHai);

        if(!user || !target){
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }

        const isFollowing = await user.following.includes(jiskofollowKarnaHai);
        if(isFollowing){
            await Promise.all([
                User.updateOne({_id:followKarneWala},{$pull:{following:jiskofollowKarnaHai}}),
                User.updateOne({_id:jiskofollowKarnaHai},{$pull:{ followers :followKarneWala}})
            ])
            return res.status(200).json({
                message: "Unfollowed successfully",
                success: true
            })
        }
        else{
            await Promise.all([
                User.updateOne({_id:followKarneWala},{$push:{following:jiskofollowKarnaHai}}),
                User.updateOne({_id:jiskofollowKarnaHai},{$push:{ followers :followKarneWala}})
            ])

            return res.status(200).json({
                message: "User followed successfully",
                success: true
            })
        }
    }
    catch(err){
        console.log(err)
    }
}
