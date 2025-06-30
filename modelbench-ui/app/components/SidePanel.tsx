"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, History, Bookmark, Lightbulb } from "lucide-react"

interface SidePanelProps {
  isOpen: boolean
  onClose: () => void
}

const RECENT_PROMPTS = [
  "Explain quantum computing in simple terms",
  "Write a Python function for sorting algorithms",
  "Translate this text to Spanish",
  "Summarize the latest AI research trends",
]

const PRESET_PROMPTS = [
  {
    title: "Code Review",
    prompt: "Please review this code and suggest improvements for performance and readability:",
  },
  {
    title: "Creative Writing",
    prompt: "Write a short story about a robot discovering emotions for the first time:",
  },
  {
    title: "Data Analysis",
    prompt: "Analyze this dataset and provide insights on trends and patterns:",
  },
  {
    title: "Problem Solving",
    prompt: "Help me solve this complex problem step by step:",
  },
]

export default function SidePanel({ isOpen, onClose }: SidePanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 bg-slate-800/90 backdrop-blur-xl border-l border-slate-700/50 z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Quick Access</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 transition-all"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Recent History */}
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <History className="w-5 h-5 text-blue-400" />
                  <h4 className="font-medium text-slate-200">Recent Prompts</h4>
                </div>
                <div className="space-y-2">
                  {RECENT_PROMPTS.map((prompt, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="w-full text-left p-3 bg-slate-700/30 hover:bg-slate-600/30 rounded-xl text-sm text-slate-300 transition-all border border-slate-600/20"
                    >
                      {prompt}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Preset Prompts */}
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <Bookmark className="w-5 h-5 text-purple-400" />
                  <h4 className="font-medium text-slate-200">Preset Templates</h4>
                </div>
                <div className="space-y-3">
                  {PRESET_PROMPTS.map((preset, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 bg-slate-700/30 hover:bg-slate-600/30 rounded-xl transition-all border border-slate-600/20 cursor-pointer"
                    >
                      <h5 className="font-medium text-slate-200 mb-2">{preset.title}</h5>
                      <p className="text-xs text-slate-400 line-clamp-2">{preset.prompt}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  <h4 className="font-medium text-slate-200">Pro Tips</h4>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
                    <p className="text-sm text-slate-300">Be specific in your prompts for better results</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                    <p className="text-sm text-slate-300">Compare multiple models to find the best response</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20">
                    <p className="text-sm text-slate-300">Use preset tasks for common use cases</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
