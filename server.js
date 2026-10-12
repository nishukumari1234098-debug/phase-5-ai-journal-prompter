import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { GoogleGenAI } from "@google/genai"

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

app.post("/journal-prompt", async (req, res) => {
    try{
        const mood = req.body.mood

        if(!mood){
            return res.status(400).json({
                success: false,
                message: "Mood is required in JSON body!"
            })
        }

        const prompt = `Write a short, encouraging journal prompt for someone feeling ${mood}.`

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        })

        res.status(200).json({
            success:true,
            prompt: response.text
        })
    } catch(err){
        console.error("Gemini Error:", err.message)

        res.status(500).json({
            success: false,
            message: "Something went wrong on the server"
        })
    }
})

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
    console.log("Server is started")
})