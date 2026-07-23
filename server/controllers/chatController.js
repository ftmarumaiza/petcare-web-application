const { GoogleGenAI } = require("@google/genai");
const Chat = require("../models/Chat");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const modelName = process.env.GEMINI_MODEL || "gemini-3.5-flash";
const fallbackModels = [
  modelName,
  ...(process.env.GEMINI_FALLBACK_MODELS || "")
    .split(",")
    .map((model) => model.trim())
    .filter(Boolean),
  "gemini-3.5-flash-lite",
  "gemini-2.5-flash-lite",
].filter((model, index, models) => models.indexOf(model) === index);

// PawDoc AI's identity + scope, inspired by the "Pawdoc AI" concept in Petzify
// (24/7 AI pet health assistant) - kept strictly to pet topics, never presents
// itself as a replacement for an actual vet.
const SYSTEM_PROMPT =
  "You are PawDoc AI, a friendly and knowledgeable AI pet care assistant. " +
  "You can only answer questions related to pets, including: pet care, nutrition, " +
  "grooming, vaccinations, exercise, behaviour, and basic health guidance. " +
  "You are not a licensed veterinarian, so for anything that sounds like a medical " +
  "emergency or a serious symptom, gently advise the user to consult a real vet. " +
  "If the user asks anything unrelated to pets, politely respond that you are " +
  "PawDoc AI and can only help with pet-related topics.";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableGeminiError = (err) =>
  [429, 500, 502, 503, 504].includes(err.status) ||
  err.message?.includes("429") ||
  err.message?.includes("503") ||
  err.message?.toLowerCase().includes("quota") ||
  err.message?.toLowerCase().includes("unavailable");

const getGeminiErrorMessage = (err) => {
  if (err.message?.includes("429") || err.message?.toLowerCase().includes("quota")) {
    return {
      status: 429,
      message:
        "PawDoc AI has hit its Gemini API quota. Check your Google AI quota or billing, then try again.",
    };
  }

  if (
    err.status === 404 ||
    (err.message?.includes("404") &&
      (err.message?.includes("models/") || err.message?.toLowerCase().includes("not found")))
  ) {
    return {
      status: 500,
      message:
        "PawDoc AI is configured with an unavailable Gemini model. Update GEMINI_MODEL and try again.",
    };
  }

  if (err.status === 503 || err.message?.includes("503")) {
    return {
      status: 503,
      message:
        "PawDoc AI is temporarily busy on Gemini right now. Please try again in a moment.",
    };
  }

  return {
    status: 500,
    message: "Something went wrong talking to PawDoc AI. Try again in a bit.",
  };
};

const createResponseStream = async (message) => {
  let lastError;

  for (const model of fallbackModels) {
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        return {
          model,
          stream: await ai.models.generateContentStream({
            model,
            contents: message,
            config: {
              systemInstruction: SYSTEM_PROMPT,
            },
          }),
        };
      } catch (err) {
        lastError = err;

        console.error("Gemini stream attempt failed:", {
          model,
          attempt,
          message: err.message,
          status: err.status,
        });

        if (!isRetryableGeminiError(err) || attempt === 3) {
          break;
        }

        await sleep(500 * 2 ** (attempt - 1));
      }
    }
  }

  throw lastError;
};

const generateAnswerText = async (message) => {
  const { stream } = await createResponseStream(message);
  let answer = "";

  for await (const chunk of stream) {
    answer += chunk.text || "";
  }

  return answer.trim();
};

// @desc   Send a message to PawDoc AI
// @route  POST /api/chat
const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("Gemini API error: GEMINI_API_KEY is missing");
      return res.status(500).json({
        message: "PawDoc AI is missing its Gemini API key. Update server environment variables and try again.",
      });
    }

    const answer = await generateAnswerText(message);

    if (!answer) {
      throw new Error("Gemini returned an empty response");
    }

    // save to chat history so we have something to show on the frontend
    const chat = await Chat.create({
      userId: req.user._id,
      question: message,
      answer,
    });

    res.status(201).json(chat);
  } catch (err) {
    console.error("Gemini API error:", {
      message: err.message,
      status: err.status,
      code: err.code,
      details: err.errorDetails || err.details || err.cause || null,
    });
    const errorResponse = getGeminiErrorMessage(err);
    res.status(errorResponse.status).json({ message: errorResponse.message });
  }
};

// @desc   Stream a message from PawDoc AI
// @route  POST /api/chat/stream
const streamMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("Gemini API error: GEMINI_API_KEY is missing");
      return res.status(500).json({
        message: "PawDoc AI is missing its Gemini API key. Update server environment variables and try again.",
      });
    }

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("X-Accel-Buffering", "no");

    const { model, stream: responseStream } = await createResponseStream(message);

    let answer = "";

    for await (const chunk of responseStream) {
      const text = chunk.text || "";
      if (!text) {
        continue;
      }

      answer += text;
      res.write(text);
    }

    console.log("Gemini stream completed with model:", model);

    res.end();

    if (answer.trim()) {
      Chat.create({
        userId: req.user._id,
        question: message,
        answer,
      }).catch((saveErr) => {
        console.error("Chat history save error:", saveErr.message);
      });
    }
  } catch (err) {
    console.error("Gemini API error:", {
      message: err.message,
      status: err.status,
      code: err.code,
      details: err.errorDetails || err.details || err.cause || null,
    });

    const errorResponse = getGeminiErrorMessage(err);
    if (!res.headersSent) {
      return res.status(errorResponse.status).json({ message: errorResponse.message });
    }

    res.end();
  }
};

// @desc   Get chat history for logged in user
// @route  GET /api/chat
const getChatHistory = async (req, res, next) => {
  try {
    const chats = await Chat.find({ userId: req.user._id }).sort({ createdAt: 1 });
    res.json(chats);
  } catch (err) {
    next(err);
  }
};

module.exports = { sendMessage, streamMessage, getChatHistory };
