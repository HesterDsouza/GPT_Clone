import express, { text } from "express";
import cors from "cors";
import ImageKit from "imagekit";
import mongoose from "mongoose";
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'
import Chat from "./models/chat.js";
import UserChats from "./models/userChat.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}))

app.use(express.json())

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO)
        console.log("Connected to MongoDB Database!")
    } catch (err) {
        console.log(err)
    }
}

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY
});

app.get("/api/upload",(req,res)=>{
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
})

// app.get("/api/test", ClerkExpressRequireAuth(), (req, res) => {
//     const userId = req.auth.userId;
//     console.log(userId);
//     res.send("Test route working!")
// })

app.post("/api/chats", ClerkExpressRequireAuth({}), async (req,res)=>{
    const userId = req.auth.userId;
    const { text} = req.body;
    try {
        //CREATE NEW CHAT
        const newChat = new Chat({
            userId: userId,
            history: [{ role: "user", parts: [{ text }]}],
        });

        const savedChat = await newChat.save()

        // CHECK IF USERCHATS EXISTS
        const userChats = await UserChats.find({userId: userId})

        // IF CHAT DOES NOT EXIST, CREATE NEW ONE AND ADD IT IN THE CHATS ARRAY
        if(!userChats.length){
            const newUserChats = new UserChats({
                userId: userId,
                chats: [
                    {
                        _id: savedChat._id,
                        title: text.substring(0, 40),
                    }
                ]
            })
            await newUserChats.save()
        } else {
            // IF CHAT EXISTS, PUSH THE CHAT TO THE EXISTING ARRAY
            await UserChats.updateOne({userId: userId}, 
            {
            $push: {
                chats: {
                    _id: savedChat._id,
                    title: text.substring(0, 40),
                    }
                }
            })

            res.status(201).send(newChat._id)
        }
        
    } catch (err) {
        console.error(err)
        res.status(500).send("Error Creating chat!")
    }
});

app.get("/api/userChats", ClerkExpressRequireAuth(), async(req, res) => {
    const userId = req.auth.userId;
    try {
        const userChats = await UserChats.find({userId: userId})
        res.status(200).send(userChats[0].chats);
    } catch (err) {
        console.log(err)
        res.status(500).send("Error fetching user Chats")
    }
});

app.get("/api/chats/:id", ClerkExpressRequireAuth(), async(req, res) => {
    const userId = req.auth.userId;
    try {
        const chat = await Chat.findOne({ _id: req.params.id, userId: userId})
        res.status(200).send(chat);
    } catch (err) {
        console.log(err)
        res.status(500).send("Error fetching chat!")
    }
});

app.put("/api/chats/:id", ClerkExpressRequireAuth(), async (req, res) => {
    const userId = req.auth.userId;
    const {question, answer, img} = req.body;
    const newItems = [
        ...(question ? [{role: "user", parts: [{text: question}], ...(img && { img })}] : []),
        {role: "model", parts: [{text: answer}]},
    ]

    try {
        const updatedChat = await Chat.updateOne({ _id: req.params.id, userId: userId}, {
            $push: {
                history:{
                    $each: newItems,
                }
            }
        })
        res.status(200).send(updatedChat);
    } catch (err) {
        console.log(err)
        res.status(500).send("Error adding conversation!")
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(401).send('Unauthenticated!')
  });

app.listen(PORT, ()=>{
    connect()
    console.log(`Server is running on port: ${PORT}`)
})