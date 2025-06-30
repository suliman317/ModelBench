"use client"

import { Copy, ThumbsUp, ThumbsDown, Clock, Coins, Hash } from "lucide-react"
import type { ModelResult } from "../types"

interface ModelOutputGridProps {
  results: ModelResult[]
  isLoading: boolean
  selectedModels: string[]
}

const MODELS = [
  { id: "gpt-4", name: "GPT-4", color: "emerald" },
  { id: "claude", name: "Claude", color: "orange" },
  { id: "mistral", name: "Mistral", color: "purple" },
  { id: "llama", name: "LLaMA", color: "red" },
  { id: "gemini", name: "Gemini", color: "blue" },
]

function LoadingSkeleton({ modelId }: { modelId: string }) {
  const model = MODELS.find((m) => m.id === modelId)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`px-3 py-1 rounded-full bg-${model?.color}-100 dark:bg-${model?.color}-900/30`}>
          <span className={`text-sm font-medium text-${model?.color}-700 dark:text-${model?.color}-300`}>
            {model?.name}
          </span>
        </div>
        <div className="animate-pulse w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="animate-pulse h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="animate-pulse h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="animate-pulse h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
        <div className="animate-pulse h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>

      <div className="flex justify-between">
        <div className="animate-pulse h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="flex space-x-2">
          <div className="animate-pulse h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="animate-pulse h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  )
}

function ModelCard({ result }: { result: ModelResult }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.output)
    } catch (err) {
      console.error("Failed to copy text:", err)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`px-3 py-1 rounded-full bg-${result.color}-100 dark:bg-${result.color}-900/30`}>
          <span className={`text-sm font-medium text-${result.color}-700 dark:text-${result.color}-300`}>
            {result.name}
          </span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{result.latency}ms</div>
      </div>

      <div className="mb-6">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-64 overflow-y-auto">
          <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-sans">{result.output}</pre>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
          <div className="flex items-center justify-center mb-1">
            <Clock className="w-4 h-4 text-gray-500" />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Latency</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">{result.latency}ms</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
          <div className="flex items-center justify-center mb-1">
            <Hash className="w-4 h-4 text-gray-500" />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Tokens</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">{result.tokens}</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
          <div className="flex items-center justify-center mb-1">
            <Coins className="w-4 h-4 text-gray-500" />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Cost</div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">${result.cost.toFixed(4)}</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={handleCopy}
          className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
        >
          <Copy className="w-4 h-4" />
          <span className="text-sm">Copy</span>
        </button>

        <div className="flex space-x-2">
          <button className="p-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group">
            <ThumbsUp className="w-4 h-4 text-gray-500 group-hover:text-green-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors group">
            <ThumbsDown className="w-4 h-4 text-gray-500 group-hover:text-red-600" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ModelOutputGrid({ results, isLoading, selectedModels }: ModelOutputGridProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Model Comparison Results</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading
          ? selectedModels.map((modelId) => <LoadingSkeleton key={modelId} modelId={modelId} />)
          : results.map((result) => <ModelCard key={result.id} result={result} />)}
      </div>
    </div>
  )
}
