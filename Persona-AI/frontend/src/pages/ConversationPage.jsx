import Navbar from "../components/Navbar";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ✅ Use environment variable for API base URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const personaImages = {
  hitesh: "/hitesh.jpg",
  piyush: "/piyush.jpeg",
  guest: "/user.jpg",
};

const personaMap = {
  "Hitesh Choudhary": "hitesh",
  Hitesh: "hitesh",
  "Piyush Garg": "piyush",
  Piyush: "piyush",
  guest: "guest",
  Guest: "guest",
};

function formatTimestamp(isoString, now) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const diffMs = now - date.getTime();
  if (diffMs < 30000) return "Just now"; // less than 30 seconds
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins} min ago`;
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function TickIcon({ dark, className }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill={dark ? "#90cdf4" : "#1E40AF"}
      viewBox="0 0 24 24"
      width="16"
      height="16"
    >
      <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
    </svg>
  );
}

export default function ConversationPage() {
  const location = useLocation();
  const selectedPersonaName = location.state?.persona || "guest";
  const personaId = personaMap[selectedPersonaName] || "guest";

  const getInitialMessages = (personaId) => {
    switch (personaId) {
      case "hitesh":
        return [
          {
            role: "bot",
            content: `Haan ji, kaise ho sab log! Swagat hai aap sabka, umeed hai sab mast honge aur energy full hogi. Chai ready hai na? Chaliye, fir shuru karte hain apni baat-cheet 😄.`,
            timestamp: new Date().toISOString(),
            read: true,
          },
        ];
      case "piyush":
        return [
          {
            role: "bot",
            content:
              "Alright!! Welcome Kaise ho sab!! Chaliye, fir shuru karte hain apni baat-cheet—main hoon Piyush Garg, aur aaj hum seedhi, practical baat karenge: real-world build, scale aur ship.",
            timestamp: new Date().toISOString(),
            read: true,
          },
        ];
      default:
        return [
          {
            role: "bot",
            content: `Hello! Kaise madad kar sakta hun aapki?`,
            timestamp: new Date().toISOString(),
            read: true,
          },
        ];
    }
  };

  const [messages, setMessages] = useState(() => getInitialMessages(personaId));
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const [now, setNow] = useState(Date.now());

  // Update "now" every 30 seconds to refresh timestamps
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const timestampNow = new Date().toISOString();

    setMessages((prev) => [
      ...prev,
      { role: "user", content: input, timestamp: timestampNow, read: true },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, personaId }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content: data.reply,
            timestamp: new Date().toISOString(),
            read: true,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content: `Error: ${data.error}`,
            timestamp: new Date().toISOString(),
            read: false,
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: `Error: ${error.message}`,
          timestamp: new Date().toISOString(),
          read: false,
        },
      ]);
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

      <div className="max-w-4xl mx-auto sm:p-6 p-4 flex flex-col h-[calc(100vh-80px)]">
        <h2 className="sm:text-3xl text-2xl font-semibold mb-6 text-primaryLight dark:text-secondaryDark">
          Conversation with {personaId.charAt(0).toUpperCase() + personaId.slice(1)}
        </h2>

        <div
          className="custom-scroll flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md sm:p-6 p-4 
          overflow-y-auto sm:mb-6 mb-4 flex flex-col sm:space-y-6 space-y-4 
          border border-gray-200 dark:border-gray-700"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => {
              const isUser = msg.role === "user";
              const avatarSrc = isUser
                ? personaImages.guest
                : personaImages[personaId] || personaImages.guest;
              const timestamp = formatTimestamp(msg.timestamp, now);

              return (
                <motion.div
                  key={i}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={messageVariants}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`flex flex-col max-w-[70%] sm:max-w-[70%] ${
                    isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  <div className="flex items-end">
                    <img
                      src={avatarSrc}
                      alt={`${isUser ? "User" : personaId} avatar`}
                      className="w-10 h-10 rounded-full object-cover shadow-md"
                    />
                    <div
                      className={`rounded-lg sm:px-5 px-3 sm:py-3 py-2 whitespace-pre-wrap shadow-md transition-colors sm:ml-3 ml-2 sm:mr-3 mr-2 ${
                        isUser
                          ? "bg-primaryLight text-white dark:bg-secondaryDark"
                          : "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-200"
                      } message-content text-xs sm:text-sm md:text-base`}
                      dangerouslySetInnerHTML={{ __html: msg.content }}
                    />
                  </div>

                  {isUser && (
                    <div className="flex items-center justify-end pr-10 text-[10px] sm:text-xs select-none text-gray-500 dark:text-gray-400 mt-0.5">
                      <span>{timestamp}</span>
                      <div className="flex ml-1">
                        {msg.read && <TickIcon dark={false} />}
                        {msg.read && <TickIcon dark={false} className="ml-[-4px]" />}
                      </div>
                    </div>
                  )}

                  {!isUser && timestamp && (
                    <div className="text-xs select-none pl-14 text-gray-400 dark:text-gray-500 mt-0.5">
                      {timestamp}
                    </div>
                  )}
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
                src={personaImages[personaId] || personaImages.guest}
                alt={`${personaId} avatar`}
                className="w-10 h-10 rounded-full object-cover shadow-md"
              />
              <div className="rounded-lg bg-gray-100 dark:bg-gray-700 ml-3 mr-3 px-5 py-3 flex flex-col items-center">
                <div className="flex space-x-2 mb-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce animation-delay-150">.</span>
                  <span className="animate-bounce animation-delay-300">.</span>
                </div>
                <div className="rounded-lg bg-gray-100 dark:bg-gray-700 ml-2 mr-2 sm:ml-3 sm:mr-3 px-3 py-2 flex flex-col items-center">
                  <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm select-none">
                    Typing...
                  </span>
                </div>
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
          className="flex sm:gap-4 gap-2 px-2 sm:px-0"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 sm:px-4 sm:py-3
              text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800
              focus:outline-none focus:ring-2 focus:ring-secondaryLight transition text-sm sm:text-base"
            autoFocus
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-secondaryLight dark:bg-primaryLight text-white font-semibold rounded-lg sm:px-6 sm:py-3 px-4 py-2
              hover:bg-secondaryDark dark:hover:bg-secondaryDark disabled:opacity-50 disabled:cursor-not-allowed
              shadow transition text-sm sm:text-base"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
