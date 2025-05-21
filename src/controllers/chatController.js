// src/controllers/chatController.js
const fs = require("fs");
const path = require("path");
const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const { GoogleGenerativeAI } = require("@google/generative-ai");

let vectorStore = null;
let isInitializing = false;

async function initializeKnowledgeBase() {
  if (isInitializing || vectorStore) return;

  try {
    isInitializing = true;
    console.log("Initializing vector store...");

    const pdfPath = path.join(__dirname, "..", "..", "docs", "user_manual.pdf");
    if (!fs.existsSync(pdfPath)) {
      throw new Error("User manual not found.");
    }

    const loader = new PDFLoader(pdfPath);
    const docs = await loader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splitDocs = await textSplitter.splitDocuments(docs);

    const embeddings = new GoogleGenerativeAIEmbeddings({
      modelName: "embedding-001",
      apiKey: process.env.GEMINI_API_KEY,
    });

    vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);
    console.log("✅ Vector store initialized.");
  } catch (err) {
    console.error("❌ Vector store error:", err);
    vectorStore = null;
  } finally {
    isInitializing = false;
  }
}

async function getStatus(req, res) {
  res.json({
    initialized: vectorStore !== null,
    initializing: isInitializing,
  });
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const chatWithGemini = async (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ error: "Question is required." });
    }

    try {
        if (!vectorStore) {
        if (!isInitializing) {
            // Try to initialize if it failed before
            await initializeKnowledgeBase();
        }
        
        if (!vectorStore) {
            return res.status(503).json({ 
            error: "Knowledge base not available.", 
            initializing: isInitializing 
            });
        }
        }

        // Search for relevant context
        const relevantDocs = await vectorStore.similaritySearch(question, 3);
        const context = relevantDocs.map(doc => doc.pageContent).join("\n\n");

        const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
        },
        });

        const prompt = `You are a helpful assistant for a Real Estate CRM application. Use the following context from the app's user manual to answer the user's question. If the question cannot be answered using the context, politely say so and suggest asking about the app's features or usage instead.

    Context from user manual:
    ${context}

    User question: ${question}

    Please provide a clear and concise response based on the context provided. Focus on being helpful and accurate. If the user asks about features or workflows not covered in the manual, politely explain that and suggest asking about documented features.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ response: text });
    } catch (error) {
        console.error("Chat error:", error);
        res.status(500).json({ 
        error: "Failed to process your question.", 
        details: error.message 
        });
    }
  };

module.exports = {
  initializeKnowledgeBase,
  getStatus,
  chatWithGemini,
};
