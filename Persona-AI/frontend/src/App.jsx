import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ConversationPage from "./pages/ConversationPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-light dark:bg-gradient-dark 
                    text-gray-900 dark:text-gray-100 font-raleway transition-colors duration-700">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/conversation" element={<ConversationPage />} />
      </Routes>
    </div>
  );
}
