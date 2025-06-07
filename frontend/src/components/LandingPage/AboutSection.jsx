import { CheckCircle } from "lucide-react"

const missions = [
  "Democratize access to high-quality interview preparation",
  "Bridge the gap between academic learning and industry requirements",
  "Provide personalized learning experiences for every student",
  "Build a supportive community of aspiring developers",
]

const AboutSection = () => {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30 w-full min-h-screen">
      <div className="w-full mx-auto min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto min-h-screen">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Our Mission & Vision</h2>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              INT_PREP was born from the understanding that technical interview preparation shouldn't be a privilege. We
              believe every aspiring developer deserves access to world-class resources and guidance to achieve their
              career goals.
            </p>

            <div className="space-y-4">
              {missions.map((mission, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">{mission}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">IP</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">What Sets Us Apart</h3>
              <p className="text-slate-300 leading-relaxed">
Unlike other platforms, we focus on building a comprehensive learning ecosystem that blends top-tier coding challenges with in-depth explanations, interactive practice, and a vibrant, supportive community to help you master coding interviews.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
