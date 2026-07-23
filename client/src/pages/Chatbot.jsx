import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { FiSend, FiActivity } from "react-icons/fi";
import api from "../services/api";
import Navbar from "../components/Navbar";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get("/chat");
        const msgs = data.flatMap((c) => [
          { id: `${c._id}-user`, role: "user", text: c.question },
          { id: `${c._id}-assistant`, role: "assistant", text: c.answer },
        ]);
        setMessages(msgs);
      } catch (err) {
        // not a big deal if this fails, just start fresh
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const question = input.trim();
    const messageId = Date.now();
    const userMessage = { id: `user-${messageId}`, role: "user", text: question };
    const assistantMessage = {
      id: `assistant-${messageId}`,
      role: "assistant",
      text: "",
      pending: true,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");
    setSending(true);

    try {
      const response = await fetch(`${api.defaults.baseURL}/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ message: question }),
      });

      if (!response.ok) {
        let errorMessage = "The assistant is unavailable right now";

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // fall back to the default message if the error body isn't JSON
        }

        throw new Error(errorMessage);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response stream received from PawDoc AI");
      }

      let streamedText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }

        streamedText += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? { ...msg, text: streamedText, pending: false }
              : msg
          )
        );
      }

      const finalText = streamedText + decoder.decode();
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? {
                ...msg,
                text: finalText.trim() || "PawDoc AI could not generate a reply.",
                pending: false,
              }
            : msg
        )
      );
    } catch (err) {
      toast.error(err.message || "The assistant is unavailable right now");
      setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessage.id));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <Navbar />

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-primary-600 dark:bg-gray-800 dark:text-primary-400">
            <FiActivity size={18} />
          </span>
          <div>
            <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              PawDoc AI
            </h1>
            <p className="text-xs text-gray-400">Your 24/7 pet care companion</p>
          </div>
        </div>

        <div className="chat-scroll flex-1 space-y-3 overflow-y-auto rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          {loadingHistory ? (
            <p className="text-center text-sm text-gray-400">Loading chat history...</p>
          ) : messages.length === 0 ? (
            <p className="text-center text-sm text-gray-400">
              Hi, I&apos;m PawDoc AI. Ask me anything about pet care, nutrition,
              grooming, vaccinations, exercise, behaviour, or basic health guidance.
              For emergencies, please contact a real vet.
            </p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-primary-500 text-white"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  }`}
                >
                  {msg.text || (msg.pending ? "PawDoc AI is thinking..." : "")}
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSend} className="mt-3 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask PawDoc AI, e.g. What should I feed my puppy?"
            className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-primary-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          />
          <button
            type="submit"
            disabled={sending}
            className="rounded-full bg-primary-500 px-4 py-2 text-white hover:bg-primary-600 disabled:opacity-60"
          >
            <FiSend />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
