const Conversation = require('../models/conversation')
const Message = require('../models/message')

module.exports.sendMessage = async (req,res) => {
    try{
        const senderId = req.id;
        const receiverId = req.params.id
        const {message} = req.body

        let conversation = await Conversation.findOne({
            participants: {$all : [senderId,receiverId] }
        })

        if(!conversation){
            conversation = await Conversation.create({
                participants : [senderId,receiverId]
            })
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        })
        
        if(newMessage){
            conversation.messages.push(newMessage._id)
        }

        await Promise.all([conversation.save() , newMessage.save() ])

        // implement socket.io for real time messaging

        return res.status(200).json({
            message: "Message sent successfully",
            success: true,
            newMessage
        })        

    }catch(err){
        console.error(err)
    }
}

module.exports.getMessages = async (req,res) => {
    try{
        const senderId = req.id;
        const receiverId = req.params.id

        let conversation = await Conversation.find({
            participants: {$all : [senderId,receiverId] }
        })

        
        if(!conversation){
            return res.status(200).json({
                message: [],
                success: true
            })
        }
        await conversation.populate({path:"messages"})
        return res.status(200).json({
            success: true,
            message: conversation.messages
        })
    }catch(err){
        console.error(err) 
    }
}