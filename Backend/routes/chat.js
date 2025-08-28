import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";

const router = express.Router();

router.post("/test", async(req,res) => {
    try{
        const thread=new Thread({
            threadID:"def",
            title:"Sample thread 3 "
        });

        const response= await thread.save();
        res.send(response);
    }catch(err){
        console.log("Error saving thread:",err.message);
        res.status(500).json({error:"Failed to save in DB"});
    }
});

router.get("/thread",async(req,res) => {
    try{
        const threads=await Thread.find({}).sort({updatedAt:-1});
        res.json(threads);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to fetch threads"});
    }
});


router.get("/thread/:threadID" , async(req,res) => {
    const {threadID}=req.params;
    try{
        const thread=await Thread.findOne({threadID});
        if(!thread){
        res.status(404).json({error:"Thread not found"});
        }
        res.json(thread.message);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to fetch chat"});
    }
});

router.delete("/thread/:threadID" , async(req,res) => {
    const {threadID} = req.params;

    try{
        const deletedThread = await Thread.findOneAndDelete({threadID});
        if(!deletedThread){
            res.status(404).json({error:"Thread could not found"});
        }

        res.status(200).json({success:"Thread deleted successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to delete threads"});
    }
});


router.post("/chat" ,async(req,res) => {
    const {threadID,message}=req.body;

    if(! threadID || !message){
        res.status(400).json({error:"missing required fields"});
    }

    try{
        let thread=await Thread.findOne({threadID});
        if(!thread){
            thread = new Thread({
                threadID,
                title:message,
                messages:[{role:"user", content:message}]
            });
        }else{
            thread.messages.push({role:"user", content:message});
        }

        const assistantReply= await getOpenAIAPIResponse(message);
        
        thread.messages.push({role:"assistant", content:assistantReply});
        thread.updatedAt=new Date();

        await thread.save();
        res.json({reply:assistantReply});


    }catch(err){
        console.log(err);
        res.status(500).json({error:"something went wrong"});
    }
});

export default router;