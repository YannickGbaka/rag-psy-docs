import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { uploadFile } from './helper.ts';
import { generatePrompt, loadDocs, splidDocs, vectorSaveAndSearch } from './services/rag.service.ts';
import generateOutput from './services/ai.service.ts';

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
    const {question} = request.body;
    const loadedDocs = await loadDocs('./src/data/sample.pdf');
    console.log("loaded pdff");
    const splits = await splidDocs(loadedDocs);
    console.log("doc splitted");
    const searches = await vectorSaveAndSearch(splits, question);
    console.log('find simarl search');
    const prompt = await generatePrompt(searches, question);
    console.log('prompt gave, waiting for the response');
    const result = await generateOutput(prompt);
    console.log('got it ');

    response.json({
        message: "Content has been generated successfully.",
        data: {
          content: result.content,
        },
      });
});

export default app;
