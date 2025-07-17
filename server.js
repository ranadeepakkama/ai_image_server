import express from 'express'
import cors from 'cors'
import { GoogleGenAI, Modality } from "@google/genai";


const app = express()
app.use(cors());
app.use(express.json());

const API_KEY = process.env.REACT_APP_HF_API_KEY;

app.post('/api/generate-image', async (req,res) => {
    try{
        const {prompt} = req.body
        const ai = new GoogleGenAI({apiKey: API_KEY});

        // Set responseModalities to include "Image" so the model can generate  an image
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-preview-image-generation",
            contents: prompt,
            config: {
                responseModalities: [Modality.TEXT,Modality.IMAGE],
            },
        });
        
        const imgPart = response.candidates[0].content.parts.find(
            part => part.inlineData
        )

        if(!imgPart){
            throw new Error('No Image generated')
        }

        res.json({
            image: imgPart.inlineData.data,
            mimeType:'image/png'
        })
    }catch(e){
         console.error('Generation error:', e);
        res.status(500).json({ error: e.message })
    }
})


const PORT = 3001;
app.listen(PORT,() => {
    console.log(`server is running on ${PORT}`)
    })