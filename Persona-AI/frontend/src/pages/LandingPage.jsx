import PersonaCard from "../components/PersonaCard";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <Navbar />

      <div className="px-6 py-12 text-center">
        <h1 className="text-4xl font-bold text-primaryLight dark:text-secondaryDark mb-6">
          Meet Our Personas
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <PersonaCard
            name="Hitesh"
            role="Software Technology Expert"
            imgSrc="/hitesh.jpg"
          />
          <PersonaCard
            name="Piyush Garg"
            role="Backend Expert,Full Stack Developer,Tutor"
            imgSrc="/piyush.jpeg"
          />
        </div>
      </div>
    </div>
  );
}
