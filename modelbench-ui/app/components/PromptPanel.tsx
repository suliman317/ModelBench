"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play, Loader2, Sparkles, Code, Languages, FileText, MessageSquare } from "lucide-react"

interface PromptPanelProps {
  prompt: string
  setPrompt: (prompt: string) => void
  selectedModels: string[]
  setSelectedModels: (models: string[]) => void
  presetTask: string
  setPresetTask: (task: string) => void
  onRunComparison: () => void
  isRunning: boolean
}

const MODELS = [
  { id: "gpt-4", name: "GPT-4", logo: "🤖", color: "from-emerald-400 to-emerald-600" },
  { id: "claude", name: "Claude", logo: "🎭", color: "from-orange-400 to-orange-600" },
  { id: "mistral", name: "Mistral", logo: "⚡", color: "from-purple-400 to-purple-600" },
  { id: "llama", name: "LLaMA", logo: "🦙", color: "from-red-400 to-red-600" },
  { id: "gemini", name: "Gemini", logo: "💎", color: "from-blue-400 to-blue-600" },
]

const PRESET_TASKS = [
  { value: "open-ended", label: "Open-Ended", icon: MessageSquare },
  { value: "summarization", label: "Summarization", icon: FileText },
  { value: "translation", label: "Translation", icon: Languages },
  { value: "code", label: "Code Generation", icon: Code },
]

const PRESET_PROMPTS = {
  summarization:
    "Please summarize the following text in 3-4 sentences, highlighting the key points and main conclusions:",
  translation: "Translate the following text from English to French, maintaining the original tone and meaning:",
  code: "Write a Python function that takes a list of numbers and returns the sum of all even numbers in the list. Include error handling and documentation:",
}

export default function PromptPanel({
  prompt,
  setPrompt,
  selectedModels,
  setSelectedModels,
  presetTask,
  setPresetTask,
  onRunComparison,
  isRunning,
}: PromptPanelProps) {
  const [isTyping, setIsTyping] = useState(false)

  const handleModelToggle = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      setSelectedModels(selectedModels.filter((id) => id !== modelId))
    } else {
      setSelectedModels([...selectedModels, modelId])
    }
  }

  const handlePresetChange = (task: string) => {
    setPresetTask(task)
    if (task !== "open-ended" && PRESET_PROMPTS[task as keyof typeof PRESET_PROMPTS]) {
      setPrompt(PRESET_PROMPTS[task as keyof typeof PRESET_PROMPTS])
    }
  }

  const canRun = prompt.trim() && selectedModels.length > 0 && !isRunning

  return (
    <div id="prompt-section" className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="backdrop-blur-xl bg-slate-800/40 rounded-3xl border border-slate-700/50 p-8 shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2"
          >
            Compare AI Models
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-slate-400"
          >
            Enter your prompt and select models to compare their responses
          </motion.p>
        </div>

        {/* Preset Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <label className="block text-sm font-medium text-slate-300 mb-3">Task Type</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PRESET_TASKS.map((task) => {
              const Icon = task.icon
              return (
                <motion.button
                  key={task.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePresetChange(task.value)}
                  className={`p-4 rounded-xl border transition-all ${
                    presetTask === task.value
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/50 text-blue-300"
                      : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-700/50 hover:border-slate-600/50"
                  }`}
                >
                  <Icon className="w-5 h-5 mx-auto mb-2" />
                  <div className="text-sm font-medium">{task.label}</div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Prompt Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <label htmlFor="prompt-input" className="block text-sm font-medium text-slate-300 mb-3">
            Your Prompt
          </label>
          <div className="relative">
            <textarea
              id="prompt-input"
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value)
                setIsTyping(true)
                setTimeout(() => setIsTyping(false), 1000)
              }}
              placeholder="Enter your prompt here..."
              rows={6}
              className="w-full px-6 py-4 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
            />
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-4 right-4"
              >
                <div className="w-2 h-5 bg-blue-400 animate-pulse rounded-full"></div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Model Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <label className="block text-sm font-medium text-slate-300 mb-3">Select Models</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {MODELS.map((model) => (
              <motion.button
                key={model.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleModelToggle(model.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedModels.includes(model.id)
                    ? `bg-gradient-to-r ${model.color}/20 border-current text-white`
                    : "bg-slate-800/30 border-slate-700/50 text-slate-400 hover:bg-slate-700/30 hover:border-slate-600/50"
                }`}
                style={
                  selectedModels.includes(model.id)
                    ? { borderImage: `linear-gradient(135deg, var(--tw-gradient-stops)) 1` }
                    : {}
                }
              >
                <div className="text-2xl mb-2">{model.logo}</div>
                <div className="text-sm font-medium">{model.name}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Run Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <motion.button
            whileHover={canRun ? { scale: 1.05 } : {}}
            whileTap={canRun ? { scale: 0.95 } : {}}
            onClick={onRunComparison}
            disabled={!canRun}
            className={`inline-flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all ${
              canRun
                ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25"
                : "bg-slate-700/50 text-slate-500 cursor-not-allowed"
            }`}
          >
            {isRunning ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Running Comparison...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                <span>Run Comparison</span>
                <Play className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}
