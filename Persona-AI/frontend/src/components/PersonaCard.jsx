import { Link } from "react-router-dom";

export default function PersonaCard({ name, role, imgSrc }) {
  return (
    <div
      className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 text-center hover:shadow-xl 
      transition-all duration-500 ease-in-out transform hover:scale-105"
    >
      <img
        src={imgSrc}
        alt={name}
        className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-blue-500"
      />
      <h2 className="text-xl font-semibold mt-4">{name}</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-4">{role}</p>

      <Link
        to="/conversation"
        state={{ persona: name }} // pass persona value to ConversationPage
        className="mt-2 inline-block px-4 py-2 bg-primaryLight dark:bg-secondaryDark 
                   hover:bg-secondaryLight dark:hover:bg-primaryLight text-white 
                   rounded-lg text-sm font-medium transition-all duration-300 shadow-md"
      >
        Start Conversation with {name}
      </Link>
    </div>
  );
}
