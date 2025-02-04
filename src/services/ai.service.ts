import { ChatOllama } from "@langchain/ollama";

const generateOutput = async (prompt: string) =>{
    const ollama = new ChatOllama({
        model: "llama3.2:latest"
    });

    const response = await ollama.invoke(prompt);
    return response;
}

export default generateOutput;