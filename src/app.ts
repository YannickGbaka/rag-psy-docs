import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { uploadFile } from './helper.ts';
import { generatePrompt, loadDocs, splidDocs, vectorSaveAndSearch } from './services/rag.service.ts';
import { generateOutput, type AIProvider } from './services/ai.service.ts';

const app = express();

// Update CORS configuration to be more permissive for development
app.use(cors({
  origin: '*', // For development only - update this for production
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Disable helmet temporarily for testing
// app.use(helmet());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Add a test endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Simplify the voice chat endpoint for testing
app.post('/voice-chat', async (request, response) => {
    const { audioText } = request.body;
    
    if (!audioText) {
        return response.status(400).json({
            message: "No audio text provided"
        });
    }

    try {
        console.log('Received text:', audioText); // Debug log
        
        const result = await generateOutput(audioText, 'huggingface');
        console.log('AI Response:', result); // Debug log
        
        response.json({
            message: "Response generated successfully",
            data: {
                content: result.content || result.text,
            },
        });
    } catch (error) {
        console.error('Error in voice-chat:', error);
        response.status(500).json({
            message: "An error occurred while processing voice input",
            error: error.message
        });
    }
});

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
