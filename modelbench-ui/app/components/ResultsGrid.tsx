"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Copy, ThumbsUp, ThumbsDown, Clock, Hash, DollarSign, Check, Flag } from "lucide-react"
import type { ModelResult } from "../types"

interface ResultsGridProps {
  results: ModelResult[]
  isLoading: boolean
  selectedModels: string[]
}

const MODELS = [
  {
    id: "gpt-4",
    name: "GPT-4",
    logo: "🤖",
    color: "from-emerald-400 to-emerald-600",
    bgColor: "from-emerald-500/10 to-emerald-600/10",
  },
  {
    id: "claude",
    name: "Claude",
    logo: "🎭",
    color: "from-orange-400 to-orange-600",
    bgColor: "from-orange-500/10 to-orange-600/10",
  },
  {
    id: "mistral",
    name: "Mistral",
    logo: "⚡",
    color: "from-purple-400 to-purple-600",
    bgColor: "from-purple-500/10 to-purple-600/10",
  },
  {
    id: "llama",
    name: "LLaMA",
    logo: "🦙",
    color: "from-red-400 to-red-600",
    bgColor: "from-red-500/10 to-red-600/10",
  },
  {
    id: "gemini",
    name: "Gemini",
    logo: "💎",
    color: "from-blue-400 to-blue-600",
    bgColor: "from-blue-500/10 to-blue-600/10",
  },
]

function LoadingSkeleton({ modelId, index }: { modelId: string; index: number }) {
  const model = MODELS.find((m) => m.id === modelId)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="backdrop-blur-xl bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{model?.logo}</div>
          <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${model?.bgColor} border border-slate-600/30`}>
            <span className="text-sm font-medium text-slate-300">{model?.name}</span>
          </div>
        </div>
        <div className="animate-pulse w-16 h-4 bg-slate-700 rounded"></div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-3 mb-6">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className={`animate-pulse h-4 bg-slate-700 rounded ${i === 5 ? "w-3/4" : i === 3 ? "w-5/6" : "w-full"}`}
          ></motion.div>
        ))}
      </div>

      {/* Metrics Skeleton */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-slate-900/50 rounded-xl p-3">
            <div className="animate-pulse h-4 bg-slate-700 rounded mb-2"></div>
            <div className="animate-pulse h-6 bg-slate-700 rounded"></div>
          </div>
        ))}
      </div>

      {/* Actions Skeleton */}
      <div className="flex justify-between">
        <div className="animate-pulse h-10 w-24 bg-slate-700 rounded-xl"></div>
        <div className="flex space-x-2">
          <div className="animate-pulse h-10 w-10 bg-slate-700 rounded-xl"></div>
          <div className="animate-pulse h-10 w-10 bg-slate-700 rounded-xl"></div>
        </div>
      </div>
    </motion.div>
  )
}

function ModelCard({ result, index }: { result: ModelResult; index: number }) {
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState<boolean | null>(null)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text:", err)
    }
  }

  const handleLike = (isLike: boolean) => {
    setLiked(isLike)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ y: -5 }}
      className="backdrop-blur-xl bg-slate-800/40 rounded-2xl border border-slate-700/50 p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="text-2xl">
            {result.logo}
          </motion.div>
          <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${result.bgColor} border border-slate-600/30`}>
            <span className="text-sm font-medium text-slate-300">{result.name}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <Clock className="w-3 h-3" />
          <span>{result.latency}ms</span>
        </div>
      </div>

      {/* Output */}
      <div className="mb-6">
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-4 max-h-80 overflow-y-auto border border-slate-700/30">
          <pre className="text-sm text-slate-200 whitespace-pre-wrap font-mono leading-relaxed">{result.output}</pre>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/30 text-center"
        >
          <div className="flex items-center justify-center mb-1">
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xs text-slate-400 mb-1">Latency</div>
          <div className="text-sm font-semibold text-slate-200">{result.latency}ms</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/30 text-center"
        >
          <div className="flex items-center justify-center mb-1">
            <Hash className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-xs text-slate-400 mb-1">Tokens</div>
          <div className="text-sm font-semibold text-slate-200">{result.tokens}</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-3 border border-slate-700/30 text-center"
        >
          <div className="flex items-center justify-center mb-1">
            <DollarSign className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-xs text-slate-400 mb-1">Cost</div>
          <div className="text-sm font-semibold text-slate-200">${result.cost.toFixed(4)}</div>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl transition-all border border-slate-600/30"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-300" />
              <span className="text-sm text-slate-300">Copy</span>
            </>
          )}
        </motion.button>

        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleLike(true)}
            className={`p-2 rounded-xl transition-all ${
              liked === true
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-slate-700/50 hover:bg-green-500/10 text-slate-400 hover:text-green-400 border border-slate-600/30"
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleLike(false)}
            className={`p-2 rounded-xl transition-all ${
              liked === false
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-slate-700/50 hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-slate-600/30"
            }`}
          >
            <ThumbsDown className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-slate-300 transition-all border border-slate-600/30"
          >
            <Flag className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default function ResultsGrid({ results, isLoading, selectedModels }: ResultsGridProps) {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Comparison Results
        </h2>
        <p className="text-slate-400">{isLoading ? "Generating responses..." : `Comparing ${results.length} models`}</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        <AnimatePresence mode="wait">
          {isLoading
            ? selectedModels.map((modelId, index) => <LoadingSkeleton key={modelId} modelId={modelId} index={index} />)
            : results.map((result, index) => <ModelCard key={result.id} result={result} index={index} />)}
        </AnimatePresence>
      </div>
    </div>
  )
}
