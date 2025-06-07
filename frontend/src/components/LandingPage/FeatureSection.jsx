import { Code, Target, TrendingUp, Users, Zap, BookOpen } from "lucide-react"

const features = [
  {
    icon: Code,
    title: "Advanced Code Editor",
    description: "Full-featured code editor with syntax highlighting, auto-completion, and multiple language support.",
  },
  {
    icon: Target,
    title: "Difficulty-Based Challenges",
    description: "Problems sorted by difficulty levels from beginner to expert, helping you progress systematically.",
  },
  {
    icon: Users,
    title: "Company-Specific Questions",
    description: "Curated question sets from top tech companies like Google, Amazon, Microsoft, and more.",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Detailed analytics and progress tracking to monitor your improvement over time.",
  },
  {
    icon: Zap,
    title: "Personalized Learning",
    description: "AI-powered learning paths tailored to your strengths and areas for improvement.",
  },
  {
    icon: BookOpen,
    title: "Comprehensive Resources",
    description: "Access to tutorials, explanations, and best practices for each problem category.",
  },
]

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 w-full">
      <div className="w-full mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Core Interview Prep Features</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Everything you need to ace your technical interviews and land your dream job
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-800/50 border border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 rounded-lg p-6"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
