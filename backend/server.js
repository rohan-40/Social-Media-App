const express = require('express');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./utils/db');
const userRoutes = require('./routes/userRoute')
const postRoutes = require('./routes/postRoutes')
const messagaRoutes = require('./routes/messageRoutes')


const app = express();
const Port = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
const corsOption = {
    origin: ['http://localhost:5173'],
    credentials: true
}
app.use(cors(corsOption));

app.use('/user',userRoutes);
app.use('/post',postRoutes);
app.use('/message',messagaRoutes);

//Routes
app.get('/',(req,res) =>{
    res.status(200).json({
        messaga: "Hello, Welcome to Instagram",
        success:true
    })
})

app.listen(Port, () =>{
    connectDB()
    console.log(`Server is running on port ${Port}`);
})