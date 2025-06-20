import { ArrowRight, Play } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuthStore } from "../../store/useAuthStore"

const HeroSection = () => {
  const { authUser } = useAuthStore();
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative w-full">
      <div className="w-full mx-auto relative z-10">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-10">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent glow">
              INT_PREP
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-18 max-w-4xl mx-auto leading-relaxed">
              "A dynamic platform designed to supercharge your coding interview prep and boost your programming skills through real-world coding challenges. Level up, get hired, and become a coding pro with INT_PREP!"

          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to={authUser ? '/newpage' : '/login'}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg transition-all duration-300 hover:scale-105 rounded-md flex items-center glow-box"
            >
              Start Practicing
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>

            <button className="border border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:text-white px-8 py-3 text-lg transition-all duration-300 rounded-md flex items-center">
              <Play className="mr-2 w-5 h-5" />
                <a href="https://drive.google.com/drive/folders/1mW8RjE4DzzeuK63NcK692_5CR853ld3Y?usp=share_link" target="_blank" rel="noopener noreferrer">
                  Watch Demo
                </a>
            </button>

          </div>

          <div className="mt-25 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
            <div className="animate-float" style={{ animationDelay: "0s" }}>
              <div className="text-3xl font-bold text-purple-400 mb-2 animate-pulse-slow">100+</div>
              <div className="text-slate-400">Coding Problems</div>
            </div>
            <div className="animate-float" style={{ animationDelay: "0.5s" }}>
              <div className="text-3xl font-bold text-blue-400 mb-2 animate-pulse-slow">10+</div>
              <div className="text-slate-400">Companies</div>
            </div>
            <div className="animate-float" style={{ animationDelay: "1s" }}>
              <div className="text-3xl font-bold text-green-400 mb-2 animate-pulse-slow">1000+</div>
              <div className="text-slate-400">Students</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
