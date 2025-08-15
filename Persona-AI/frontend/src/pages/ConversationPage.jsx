import Navbar from "../components/Navbar";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const personaImages = {
  Hitesh: "/hitesh.jpg",
  "Piyush Garg": "/piyush.jpeg",
  Guest: "/user.jpg",
};

export default function ConversationPage() {
  const location = useLocation();
  const selectedPersona = location.state?.persona || "Guest";

  const [messages, setMessages] = useState([
    { role: "bot", content: `Hello! I am ${selectedPersona}, how can I assist you today?` },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);

  const sendMessage = async () => {
  if (!input.trim()) return;

  setMessages(prev => [...prev, { role: "user", content: input }]);
  setInput("");
  setLoading(true);

  try {
    const response = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, persona: selectedPersona }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessages(prev => [...prev, { role: "bot", content: data.reply }]);
    } else {
      setMessages(prev => [...prev, { role: "bot", content: `Error: ${data.error}` }]);
    }
  } catch (error) {
    setMessages(prev => [...prev, { role: "bot", content: `Error: ${error.message}` }]);
  } finally {
    setLoading(false);
  }
};


  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6 flex flex-col h-[calc(100vh-80px)]">
        <h2 className="text-3xl font-semibold mb-6 text-primaryLight dark:text-secondaryDark">
          Conversation with {selectedPersona}
        </h2>

        <div className="custom-scroll flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 
            overflow-y-auto mb-6 flex flex-col space-y-6 
            border border-gray-200 dark:border-gray-700">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => {
              const isUser = msg.role === "user";
              const avatarSrc = isUser
                ? personaImages["Guest"]
                : personaImages[selectedPersona] || personaImages["Guest"];

              return (
                <motion.div
                  key={i}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={messageVariants}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`flex items-end max-w-[70%] ${
                    isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  <img
                    src={avatarSrc}
                    alt={`${isUser ? "User" : selectedPersona} avatar`}
                    className="w-10 h-10 rounded-full object-cover shadow-md"
                  />
                  <div
                    className={`rounded-lg px-5 py-3 whitespace-pre-wrap shadow-md transition-colors ml-3 mr-3 ${
                      isUser
                        ? "bg-primaryLight text-white dark:bg-secondaryDark"
                        : "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center max-w-[70%] mr-auto"
            >
              <img
                src={personaImages[selectedPersona] || personaImages["Guest"]}
                alt={`${selectedPersona} avatar`}
                className="w-10 h-10 rounded-full object-cover shadow-md"
              />
              <div
                className="rounded-lg bg-gray-100 dark:bg-gray-700 ml-3 mr-3 px-5 py-3 flex flex-col items-center"
              >
                <div className="flex space-x-2 mb-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce animation-delay-150">.</span>
                  <span className="animate-bounce animation-delay-300">.</span>
                </div>
                <span className="text-gray-500 dark:text-gray-400 text-sm select-none">
                  Typing...
                </span>
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex gap-4"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3
                       text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800
                       focus:outline-none focus:ring-2 focus:ring-secondaryLight transition"
            autoFocus
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-secondaryLight dark:bg-primaryLight text-white font-semibold rounded-lg px-6 py-3
                       hover:bg-secondaryDark dark:hover:bg-secondaryDark disabled:opacity-50 disabled:cursor-not-allowed
                       shadow transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
