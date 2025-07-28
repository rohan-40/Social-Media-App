const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

module.exports.addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) {
      return res.status(400).json({ message: "Please upload an image." });
    }

    const imageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: 'inside' })
      .toFormat('jpeg', { quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
    const cloudinaryResponse = await cloudinary.uploader.upload(fileUri);

    const post = await Post.create({
      caption,
      image: cloudinaryResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: 'author', select: '-password' });

    return res.status(200).json({
      message: "Post created successfully",
      success: true,
      post,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

module.exports.getAllPosts = async (req, res) => {
    try{
        const post = await Post.find().sort({createdAt:-1})
        .populate({path: 'author', select: 'username , profilePicture'})
        .populate({
            path: 'comments',
            sort: {createdAt:-1},
            populate : {
                path: 'author', 
                select: 'username , profilePicture'
            }
        });

        return res.status(200).json({
            success:true,
            posts: post  
        })
    }
    catch(err){
        console.log(err);
    }
}

module.exports.getUserPost = async (req, res) => {
    try{
        const post = await Post.find({author:req.id}).sort({createdAt:-1})
        .populate({path: 'author' , select: 'username  profilePicture'})
        .populate({
            path: 'comments',
            sort: {createdAt:-1},
            populate : {
                path: 'author',
                select: 'username  profilePicture'
            }
        })
    

        return res.status(200).json({
            success:true,
            posts: post
        })
    }
    catch(err){
        console.log(err);
    }
}

module.exports.likePost = async (req, res) => {
  try {
    const likeKarneWale = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
        success: false
      });
    }

    const isLiked = post.likes.includes(likeKarneWale);

    if (isLiked) {
      post.likes.pull(likeKarneWale);
      await post.save();

      return res.status(200).json({
        message: 'Post Unliked',
        success: true,
        updatedLikes: post.likes // ✅ send updated likes array
      });
    } else {
      post.likes.push(likeKarneWale);
      await post.save();

      return res.status(200).json({
        message: 'Post Liked',
        success: true,
        updatedLikes: post.likes // ✅ send updated likes array
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: 'Something Went Wrong',
      success: false,
      error: err
    });
  }
};

module.exports.addComment = async (req, res) => {
    try{
        const postId = req.params.id;
        const userId = req.id;
        const {text} = req.body;

        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({
                message: 'Post not found',
                success: false
            })
        }

        if(!text){
            return res.status(400).json({
                message: 'Comment is required',
                success: false
            })
        }

        const comment = await Comment.create({
            text,
            author:userId,
            post:postId
        })

        await comment.populate({
            path: 'author',
            select : 'username profilePicture'
        })

        post.comments.push(comment._id);
        await post.save();

        return res.status(200).json({
            message: 'Comment added',
            success: true,
            comment: comment
        })

    }catch(err){
        console.log(err);
    }
}

module.exports.getCommentsofPost = async (req, res) => {
    try{
        const postId = req.params.id;
        const comments = await Comment.find({post:postId}).sort({createdAt:-1})
        .populate({
            path: 'author',
            select: 'username profilePicture'
        })

        if(!comments){
            return res.status(404).json({
                message: 'No comments found',
                success: false
            })
        }

        return res.status(200).json({
            message: 'Comments found',
            success: true,
            comments: comments
        })

    }catch(err){
        console.log(err);
    }
}

module.exports.deletePost = async (req, res) => {
    try{
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId)

        if(!post){
            return res.status(404).json({
                message: 'Post not found',
                success: false
            })
        }

        const isValid = await post.author.equals(authorId);
        if(!isValid){
            return res.status(401).json({
                message: 'You are not the author of this post',
                success: false
            })
        }


        await Post.findByIdAndDelete(postId)

        const user = await User.findById(authorId);
        if(user){
        user.posts.pull(postId)
        await user.save()
        }

        await Comment.deleteMany({post: postId})
        
    
        return res.status(200).json({
            message: 'Post deleted',
            success: true
        })
    }
    catch(err){
        return res.status(200).json({
            message: 'Something Wrong',
            success: false,
            error: err
        })
    }
}

module.exports.bookmarkPost = async (req, res) => {
    try{
        const postId = req.params.id;
        const userId = req.id;
        const user = await User.findById(userId)
        const post = await Post.findById(postId)

        if(!post){
            return res.status(404).json({
                message: 'Post not found',
                success: false
            })
        }

        if(user.bookmarks.includes(post._id)){
            await user.bookmarks.pull(postId)
            await user.save()
            return res.status(400).json({
                message: 'You have already bookmarked this post',
                success: false
            })
        }
        await user.bookmarks.push(postId)
        await user.save()

        return res.status(200).json({
            message: 'Post bookmarked',
            success: true
        })

    }catch(err){
        console.log(err);
    }
}