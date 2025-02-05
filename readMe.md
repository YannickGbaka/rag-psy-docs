# PSY-RAG-App

A sophisticated RAG (Retrieval-Augmented Generation) application built with TypeScript, Express.js, and LangChain. This application allows users to process PDF documents and perform intelligent question-answering using advanced language models.

## Features

- 📄 PDF Document Processing
- 🔍 Intelligent Document Search
- 💡 Question-Answering System
- 🚀 Built with LangChain and TypeScript
- 🔒 Secure API Endpoints
- 🎯 Efficient Document Chunking and Embedding

## Prerequisites

- Node.js (v16 or higher)
- TypeScript
- Ollama (for local embeddings)
- HuggingFace API key (for language model access)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/psy-rag-app.git
cd psy-rag-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your configuration:
```env
HUGGINGFACE_API_KEY=your_api_key_here
PORT=3000
```

## Running the Application

For development:
```bash
npm run dev
```

The server will start on the configured port (default: 3000).

## Project Structure

```
src/
├── app.ts          # Express application setup
├── server.ts       # Server initialization
├── helper.ts       # Utility functions
├── data/          # PDF storage directory
└── services/
    ├── rag.service.ts    # RAG implementation
    └── ai.service.ts     # AI model integration
```

## API Endpoints

- `POST /upload` - Upload PDF documents
- `POST /query` - Query the documents with questions

## Technologies Used

- TypeScript
- Express.js
- LangChain
- HuggingFace
- Ollama
- PDF-Parse

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
