import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { uploadFile } from './helper.ts';
import { generatePrompt, loadDocs, splidDocs, vectorSaveAndSearch } from './services/rag.service.ts';
import { generateOutput, type AIProvider } from './services/ai.service.ts';

const app = express();


app.use(cors());

app.use(express.json());
app.use(express.query());

app.use(helmet());
app.use(express.urlencoded({extended: true}));

app.post('/upload', uploadFile.single('file'), async (request, response)=>{
    const {file} = request;

    if(!file){
        return response.status(400).send("No file uploaded");
    }
    return response.status(200).send("File succesfully generated")
});

app.post('/generate', async (request, response)=>{
    const {
        question, 
        provider = 'huggingface'
    } = request.body;
    
    try {
        const loadedDocs = await loadDocs('./src/data/sample.pdf');
        console.log("loaded pdf");
        const splits = await splidDocs(loadedDocs);
        console.log("doc splitted");
        const searches = await vectorSaveAndSearch(splits, question, provider);
        console.log('find similar search');
        const prompt = await generatePrompt(searches, question);
        console.log('prompt gave, waiting for the response');
        const result = await generateOutput(prompt, provider as AIProvider);
        console.log('got it');

        response.json({
            message: "Content has been generated successfully.",
            data: {
                content: result.content,
            },
        });
    } catch (error) {
        console.error('Error:', error);
        response.status(500).json({
            message: "An error occurred while generating content.",
            error: error.message
        });
    }
});

export default app;
