"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Building2, Heart, Factory, Newspaper, Headphones, ArrowRight, Sparkles, TrendingUp } from "lucide-react"

interface IndustryUseCasesProps {
  onTryPrompt: (prompt: string) => void
}

const INDUSTRY_USE_CASES = [
  {
    id: "finance",
    icon: "🏦",
    lucideIcon: Building2,
    title: "Financial Trading",
    description: "Leverage AI models for financial analysis and market intelligence",
    color: "from-green-400 to-emerald-600",
    bgColor: "from-green-500/10 to-emerald-600/10",
    borderColor: "border-green-500/30",
    useCases: [
      "Compare summarization of earnings reports across different LLMs",
      "Test sentiment detection in investor statements",
      "Validate consistency of regulatory filings (e.g., 10-K, 8-K)",
      "Evaluate synthetic report generation from raw financial data",
    ],
    samplePrompt:
      "Analyze the following quarterly earnings report and provide a concise summary highlighting key financial metrics, growth trends, and potential risks for investors:\n\n[Insert earnings report text here]",
  },
  {
    id: "healthcare",
    icon: "🏥",
    lucideIcon: Heart,
    title: "Healthcare & Life Sciences",
    description: "Enhance medical documentation and research with AI comparison",
    color: "from-red-400 to-pink-600",
    bgColor: "from-red-500/10 to-pink-600/10",
    borderColor: "border-red-500/30",
    useCases: [
      "Analyze how LLMs interpret clinical notes or discharge summaries",
      "Compare accuracy in summarizing research articles or trial data",
      "Test LLMs on patient communication generation (e.g., medication instructions)",
      "Evaluate privacy-preserving LLM output variations",
    ],
    samplePrompt:
      "Convert the following clinical notes into clear, patient-friendly discharge instructions that explain the diagnosis, treatment plan, and follow-up care in simple terms:\n\n[Insert clinical notes here]",
  },
  {
    id: "manufacturing",
    icon: "🏗️",
    lucideIcon: Factory,
    title: "Manufacturing & Industrial IoT",
    description: "Optimize industrial processes with AI-powered documentation",
    color: "from-orange-400 to-amber-600",
    bgColor: "from-orange-500/10 to-amber-600/10",
    borderColor: "border-orange-500/30",
    useCases: [
      "Benchmark LLMs on translating technical manuals into plain language",
      "Summarize machine logs or maintenance reports",
      "Generate safety or training documentation from engineering specs",
      "Evaluate predictive text from sensor data pattern prompts",
    ],
    samplePrompt:
      "Transform this technical equipment manual section into clear, step-by-step safety instructions that can be easily understood by factory floor workers:\n\n[Insert technical manual text here]",
  },
  {
    id: "media",
    icon: "📰",
    lucideIcon: Newspaper,
    title: "Media & Content Publishing",
    description: "Streamline content creation and multilingual publishing workflows",
    color: "from-blue-400 to-cyan-600",
    bgColor: "from-blue-500/10 to-cyan-600/10",
    borderColor: "border-blue-500/30",
    useCases: [
      "Compare quality of headline generation and SEO descriptions",
      "Summarize long-form articles into different tone styles",
      "Run multilingual content transformation (e.g., Spanish to French)",
      "Analyze factual consistency in AI-generated news briefs",
    ],
    samplePrompt:
      "Create 5 different headline variations for this article, each optimized for different audiences (professional, casual, social media, SEO, and clickbait). Maintain factual accuracy while varying tone and style:\n\n[Insert article summary here]",
  },
  {
    id: "support",
    icon: "📱",
    lucideIcon: Headphones,
    title: "Customer Support Automation",
    description: "Enhance customer service with consistent, accurate AI responses",
    color: "from-purple-400 to-violet-600",
    bgColor: "from-purple-500/10 to-violet-600/10",
    borderColor: "border-purple-500/30",
    useCases: [
      "Test response accuracy for common support queries",
      "Measure tone/style variation (friendly vs. formal)",
      "Compare hallucination rates for domain-specific questions",
      "Fine-tune prompt engineering for chatbot integrations",
    ],
    samplePrompt:
      "Generate a helpful, empathetic customer support response to this complaint. Provide a solution while maintaining a professional yet friendly tone:\n\n'I've been trying to cancel my subscription for weeks but keep getting error messages. This is extremely frustrating and I want a full refund.'",
  },
]

export default function IndustryUseCases({ onTryPrompt }: IndustryUseCasesProps) {
  const [activeTab, setActiveTab] = useState("finance")
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const activeUseCase = INDUSTRY_USE_CASES.find((useCase) => useCase.id === activeTab)

  const handleTryPrompt = (prompt: string) => {
    onTryPrompt(prompt)
    // Smooth scroll to prompt section
    document.querySelector("#prompt-section")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    })
  }

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-500/20 mb-6">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">Industry Applications</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Industry Use Cases
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Discover how ModelBench transforms AI model comparison across different industries, from financial analysis
            to healthcare documentation
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {INDUSTRY_USE_CASES.map((useCase, index) => {
            const LucideIcon = useCase.lucideIcon
            return (
              <motion.button
                key={useCase.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(useCase.id)}
                onMouseEnter={() => setHoveredCard(useCase.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`flex items-center space-x-3 px-6 py-4 rounded-2xl border-2 transition-all duration-300 ${
                  activeTab === useCase.id
                    ? `bg-gradient-to-r ${useCase.bgColor} ${useCase.borderColor} text-white shadow-lg`
                    : "bg-slate-800/30 border-slate-700/50 text-slate-400 hover:bg-slate-700/30 hover:border-slate-600/50 hover:text-slate-300"
                }`}
              >
                <span className="text-2xl">{useCase.icon}</span>
                <div className="hidden sm:block">
                  <div className="font-medium text-sm">{useCase.title}</div>
                </div>
                <LucideIcon className="w-4 h-4" />
              </motion.button>
            )
          })}
        </motion.div>

        {/* Active Use Case Content */}
        <AnimatePresence mode="wait">
          {activeUseCase && (
            <motion.div
              key={activeUseCase.id}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="backdrop-blur-xl bg-slate-800/40 rounded-3xl border border-slate-700/50 p-8 md:p-12 shadow-2xl"
            >
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Content */}
                <div>
                  <div className="flex items-center space-x-4 mb-6">
                    <div
                      className={`p-4 rounded-2xl bg-gradient-to-r ${activeUseCase.bgColor} border ${activeUseCase.borderColor}`}
                    >
                      <span className="text-3xl">{activeUseCase.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{activeUseCase.title}</h3>
                      <p className="text-slate-400">{activeUseCase.description}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {activeUseCase.useCases.map((useCase, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="flex items-start space-x-3"
                      >
                        <div
                          className={`w-2 h-2 rounded-full bg-gradient-to-r ${activeUseCase.color} mt-2 flex-shrink-0`}
                        ></div>
                        <p className="text-slate-300 leading-relaxed">{useCase}</p>
                      </motion.div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTryPrompt(activeUseCase.samplePrompt)}
                    className={`inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r ${activeUseCase.color} hover:shadow-lg hover:shadow-current/25 rounded-xl font-semibold text-white transition-all duration-300`}
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Try This Prompt</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Visual Element */}
                <div className="relative">
                  <motion.div
                    animate={{
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className="relative"
                  >
                    {/* Main Card */}
                    <div
                      className={`backdrop-blur-xl bg-gradient-to-br ${activeUseCase.bgColor} rounded-2xl border ${activeUseCase.borderColor} p-8 shadow-2xl`}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{activeUseCase.icon}</span>
                          <div className="text-sm font-medium text-slate-300">ModelBench Analysis</div>
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400">GPT-4</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "85%" }}
                                transition={{ duration: 2, delay: 0.5 }}
                                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                              ></motion.div>
                            </div>
                            <span className="text-xs text-slate-300">85%</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400">Claude</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "92%" }}
                                transition={{ duration: 2, delay: 0.7 }}
                                className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
                              ></motion.div>
                            </div>
                            <span className="text-xs text-slate-300">92%</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400">Mistral</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "78%" }}
                                transition={{ duration: 2, delay: 0.9 }}
                                className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"
                              ></motion.div>
                            </div>
                            <span className="text-xs text-slate-300">78%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Floating Elements */}
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                      className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-sm"
                    ></motion.div>

                    <motion.div
                      animate={{
                        y: [0, 15, 0],
                        opacity: [0.3, 0.8, 0.3],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                        delay: 1,
                      }}
                      className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-r from-pink-400 to-red-400 rounded-full blur-md"
                    ></motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
