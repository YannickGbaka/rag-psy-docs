import { ChatOllama } from "@langchain/ollama";
import { HuggingFaceInference } from "@langchain/community/llms/hf";
import { BaseMessage, AIMessage, HumanMessage } from "@langchain/core/messages";

type AIProvider = 'ollama' | 'huggingface';

const getAIModel = (provider: AIProvider) => {
    switch (provider) {
        case 'huggingface':
            return new HuggingFaceInference({
                apiKey: process.env.HUGGINGFACE_API_KEY,
                model: "mistralai/Mixtral-8x7B-Instruct-v0.1", // You can change this model
                temperature: 0.7,
                maxTokens: 1000,
            });
        case 'ollama':
        default:
            return new ChatOllama({
                model: "llama2:latest"
            });
    }
};

const generateOutput = async (prompt: string, provider: AIProvider = 'huggingface') => {
    const model = getAIModel(provider);
    
    if (provider === 'huggingface') {
        const response = await model.invoke(prompt);
        return new AIMessage(response);
    } else {
        const response = await model.invoke(prompt);
        return response;
    }
};

export { generateOutput };
export type { AIProvider };