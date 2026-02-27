import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, User, Bot, Sparkles } from "lucide-react";
import Markdown from "react-markdown";
import { getFaceGPTResponse } from "./services/geminiService";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  emoji?: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState("🤖");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // The concept art shows the emoji changing BEFORE the reply.
      // We'll call Gemini to get both the sentiment-emoji and the text.
      const result = await getFaceGPTResponse(userMessage.content);
      
      // Update the big face emoji first
      setCurrentEmoji(result.emoji);

      // Add the bot message
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: result.text,
        emoji: result.emoji,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setCurrentEmoji("😵");
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content: "Oops! Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen h-[100dvh] bg-[#F5F5F0] text-[#1A1A1A] font-sans flex flex-col items-center p-4 md:p-6 overflow-hidden">
      {/* Header / Logo Area */}
      <header className="w-full max-w-2xl flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
            <Sparkles size={20} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">FaceGPT</h1>
        </div>
        <div className="text-xs font-mono uppercase tracking-widest opacity-50">
          Sentiment-Aware AI
        </div>
      </header>

      {/* Main Container - Inspired by Recipe 6: Warm Organic / Cultural */}
      <main className="w-full max-w-2xl flex flex-col gap-4 flex-1 min-h-0 overflow-hidden">
        
        {/* Static Emoji Window */}
        <section className="bg-white rounded-[32px] shadow-sm border border-black/5 p-6 flex flex-center justify-center items-center h-1/3 min-h-[180px] relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-radial-gradient from-emerald-50/50 to-transparent opacity-50" />
          <AnimatePresence mode="wait">
            <motion.div
              key={currentEmoji}
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 1.5, opacity: 0, rotate: 10 }}
              transition={{ type: "spring", damping: 12, stiffness: 100 }}
              className="text-8xl md:text-9xl select-none relative z-10"
              id="main-emoji-display"
            >
              {currentEmoji}
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-widest opacity-30">
            Current Sentiment State
          </div>
        </section>

        {/* Chat Window */}
        <section className="flex-1 bg-white rounded-[32px] shadow-sm border border-black/5 flex flex-col overflow-hidden min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-12">
                <Bot size={48} className="mb-4" />
                <p className="text-lg font-medium">How can I help you today?</p>
                <p className="text-sm">I'll react with an emoji before I reply!</p>
              </div>
            )}
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] flex gap-3 ${
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "user" ? "bg-black text-white" : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div
                    className={`p-4 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-black text-white rounded-tr-none"
                        : "bg-stone-100 text-stone-800 rounded-tl-none"
                    }`}
                  >
                    <div className="prose prose-sm max-w-none prose-invert">
                      <Markdown>{msg.content}</Markdown>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center animate-pulse">
                    <Bot size={16} />
                  </div>
                  <div className="p-4 bg-stone-100 rounded-2xl rounded-tl-none flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-6 border-t border-black/5 bg-stone-50/50">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="w-full bg-white border border-black/10 rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all disabled:opacity-50"
                id="user-input-field"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center hover:bg-stone-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                id="send-button"
              >
                <Send size={18} />
              </button>
            </form>
            <p className="text-[10px] text-center mt-3 opacity-30 uppercase tracking-widest">
              Powered by Gemini 3 Flash
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
