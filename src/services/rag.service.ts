import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { OllamaEmbeddings } from "@langchain/ollama";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { PromptTemplate } from '@langchain/core/prompts';

// Add embedding type
type EmbeddingProvider = 'ollama' | 'huggingface';

// Function to get embeddings based on provider
const getEmbeddings = (provider: EmbeddingProvider) => {
    switch (provider) {
        case 'huggingface':
            return new HuggingFaceInferenceEmbeddings({
                apiKey: process.env.HUGGINGFACE_API_KEY,
                model: "sentence-transformers/all-mpnet-base-v2", // You can change this model
            });
        case 'ollama':
        default:
            return new OllamaEmbeddings();
    }
};

const loadDocs = async (file_path: string) =>{
    const loader = new PDFLoader(file_path);
    return await loader.load();
}

const splidDocs = async (docs)=>{
 const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 0,
 })  ;

 const allSplits = await textSplitter.splitDocuments(docs);
 return allSplits;
}

const vectorSaveAndSearch = async(splits, question, provider: EmbeddingProvider = 'huggingface') => {
    const embeddings = getEmbeddings(provider);
    const vectorStore = await MemoryVectorStore.fromDocuments(splits, embeddings);

    const searches = await vectorStore.similaritySearch(question);
    return searches;
}

const generatePrompt = async (searches, question)=>{
    let context = "";

    searches.forEach((search)=>{
        context += "\n\n" + search.pageContent;
    });

    const prompt = PromptTemplate.fromTemplate(`
Answer the question based only on the following context:

{context}

---

Answer the question based on the above context: {question}
`);

    const formattedPrompt = await prompt.format({
        context: context,
        question: question,
    });
    return formattedPrompt;
}


export {loadDocs, splidDocs, vectorSaveAndSearch, generatePrompt}