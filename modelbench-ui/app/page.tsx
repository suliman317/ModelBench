"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Navigation from "./components/Navigation"
import PromptPanel from "./components/PromptPanel"
import ResultsGrid from "./components/ResultsGrid"
import SidePanel from "./components/SidePanel"
import Footer from "./components/Footer"
import type { ModelResult } from "./types"
import IndustryUseCases from "./components/IndustryUseCases"

const SAMPLE_RESULTS: ModelResult[] = [
  {
    id: "gpt-4",
    name: "GPT-4",
    logo: "🤖",
    output: `# Analysis Complete

Here's a comprehensive breakdown of your request:

## Key Insights
- **Accuracy**: 94.2% confidence in response quality
- **Context Understanding**: Full semantic comprehension achieved
- **Relevance Score**: 9.1/10

## Detailed Response
The prompt demonstrates sophisticated requirements that demand nuanced understanding. My analysis incorporates multiple factors including contextual relevance, technical accuracy, and practical applicability.

### Implementation Strategy
1. **Primary Analysis**: Core requirement identification
2. **Secondary Validation**: Cross-reference verification
3. **Output Optimization**: Response refinement

This approach ensures comprehensive coverage while maintaining precision and clarity throughout the entire response generation process.`,
    latency: 1247,
    tokens: 156,
    cost: 0.0234,
    color: "from-emerald-400 to-emerald-600",
    bgColor: "from-emerald-500/10 to-emerald-600/10",
  },
  {
    id: "claude",
    name: "Claude",
    logo: "🎭",
    output: `I'll provide a thoughtful analysis of your prompt.

## Approach & Methodology

My response strategy involves:
- **Contextual Analysis**: Deep understanding of requirements
- **Structured Reasoning**: Systematic approach to problem-solving
- **Quality Assurance**: Multi-layer validation process

## Core Response

The prompt suggests a need for comprehensive analysis with practical applications. I'll ensure my response addresses both explicit requirements and implicit expectations.

### Key Considerations:
• **Accuracy & Precision**: Maintaining factual correctness
• **Relevance & Utility**: Ensuring practical value
• **Clarity & Structure**: Organizing information effectively

This methodology ensures optimal results while maintaining the highest standards for accuracy, relevance, and user value.`,
    latency: 892,
    tokens: 142,
    cost: 0.0189,
    color: "from-orange-400 to-orange-600",
    bgColor: "from-orange-500/10 to-orange-600/10",
  },
  {
    id: "mistral",
    name: "Mistral",
    logo: "⚡",
    output: `## Prompt Analysis & Response

Based on your input, here's my structured analysis:

**Processing Framework:**
- Input validation and context extraction
- Multi-dimensional analysis approach
- Output optimization and quality control

**Core Response Elements:**

The prompt requires a balanced approach combining technical precision with clear communication. My response methodology focuses on:

1. **Comprehensive Coverage**: Addressing all aspects thoroughly
2. **Practical Application**: Ensuring actionable insights
3. **Quality Metrics**: Maintaining high standards throughout

**Implementation Details:**
- Context-aware processing
- Relevance optimization
- User-centric output formatting

This systematic approach guarantees thorough coverage while maintaining focus on the most critical and relevant aspects of your request.`,
    latency: 634,
    tokens: 128,
    cost: 0.0076,
    color: "from-purple-400 to-purple-600",
    bgColor: "from-purple-500/10 to-purple-600/10",
  },
  {
    id: "gemini",
    name: "Gemini",
    logo: "💎",
    output: `# Comprehensive Analysis Framework

Let me provide a detailed response to your prompt:

## Analysis Structure

**Primary Evaluation:**
- Context assessment and requirement identification
- Multi-factor analysis incorporating various perspectives
- Quality validation and optimization protocols

## Response Generation

**Key Components:**
- **Contextual Understanding**: Deep comprehension of requirements
- **Technical Accuracy**: Precision in information delivery
- **User Experience**: Optimized for clarity and utility

## Implementation Strategy

The prompt demonstrates complexity requiring sophisticated analysis. My approach ensures:

1. **Thorough Coverage**: All aspects addressed comprehensively
2. **Practical Value**: Actionable insights and recommendations
3. **Quality Assurance**: Multiple validation layers

**Output Optimization:**
- Structured information hierarchy
- Clear communication protocols
- User-centric formatting standards

This methodology delivers exceptional results while maintaining the highest standards for accuracy, relevance, and practical applicability.`,
    latency: 1089,
    tokens: 167,
    cost: 0.0145,
    color: "from-blue-400 to-blue-600",
    bgColor: "from-blue-500/10 to-blue-600/10",
  },
]

export default function Home() {
  const [prompt, setPrompt] = useState("")
  const [selectedModels, setSelectedModels] = useState<string[]>(["gpt-4", "claude"])
  const [presetTask, setPresetTask] = useState("open-ended")
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<ModelResult[]>([])
  const [hasRun, setHasRun] = useState(false)
  const [sidePanelOpen, setSidePanelOpen] = useState(false)

  const handleRunComparison = async () => {
    if (!prompt.trim() || selectedModels.length === 0) return

    setIsRunning(true)
    setHasRun(true)

    // Simulate API delay with staggered results
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const filteredResults = SAMPLE_RESULTS.filter((result) => selectedModels.includes(result.id))
    setResults(filteredResults)
    setIsRunning(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/50 to-slate-900"></div>
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <div className="relative z-10">
        <Navigation onToggleSidePanel={() => setSidePanelOpen(!sidePanelOpen)} />

        <main className="container mx-auto px-4 py-8 space-y-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <PromptPanel
              prompt={prompt}
              setPrompt={setPrompt}
              selectedModels={selectedModels}
              setSelectedModels={setSelectedModels}
              presetTask={presetTask}
              setPresetTask={setPresetTask}
              onRunComparison={handleRunComparison}
              isRunning={isRunning}
            />
          </motion.div>

          <AnimatePresence>
            {(hasRun || results.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <ResultsGrid results={results} isLoading={isRunning} selectedModels={selectedModels} />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <IndustryUseCases onTryPrompt={setPrompt} />
          </motion.div>
        </main>

        <Footer />

        <SidePanel isOpen={sidePanelOpen} onClose={() => setSidePanelOpen(false)} />
      </div>
    </div>
  )
}
