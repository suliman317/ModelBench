"use client"

import { Play, Loader2 } from "lucide-react"

interface PromptSectionProps {
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
  { id: "gpt-4", name: "GPT-4", color: "emerald" },
  { id: "claude", name: "Claude", color: "orange" },
  { id: "mistral", name: "Mistral", color: "purple" },
  { id: "llama", name: "LLaMA", color: "red" },
  { id: "gemini", name: "Gemini", color: "blue" },
]

const PRESET_TASKS = [
  { value: "custom", label: "Custom Prompt" },
  { value: "summarization", label: "Text Summarization" },
  { value: "translation", label: "Language Translation" },
  { value: "code", label: "Code Generation" },
  { value: "sentiment", label: "Sentiment Analysis" },
]

const PRESET_PROMPTS = {
  summarization:
    "Please summarize the following text in 3-4 sentences, highlighting the key points and main conclusions.",
  translation: "Translate the following text from English to French, maintaining the original tone and meaning.",
  code: "Write a Python function that takes a list of numbers and returns the sum of all even numbers in the list.",
  sentiment:
    "Analyze the sentiment of the following text and classify it as positive, negative, or neutral. Explain your reasoning.",
}

export default function PromptSection({
  prompt,
  setPrompt,
  selectedModels,
  setSelectedModels,
  presetTask,
  setPresetTask,
  onRunComparison,
  isRunning,
}: PromptSectionProps) {
  const handleModelToggle = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      setSelectedModels(selectedModels.filter((id) => id !== modelId))
    } else {
      setSelectedModels([...selectedModels, modelId])
    }
  }

  const handlePresetChange = (task: string) => {
    setPresetTask(task)
    if (task !== "custom" && PRESET_PROMPTS[task as keyof typeof PRESET_PROMPTS]) {
      setPrompt(PRESET_PROMPTS[task as keyof typeof PRESET_PROMPTS])
    }
  }

  const canRun = prompt.trim() && selectedModels.length > 0 && !isRunning

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="preset-task" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Preset Task
          </label>
          <select
            id="preset-task"
            value={presetTask}
            onChange={(e) => handlePresetChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {PRESET_TASKS.map((task) => (
              <option key={task.value} value={task.value}>
                {task.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Prompt
          </label>
          <textarea
            id="prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Select Models to Compare
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {MODELS.map((model) => (
            <label
              key={model.id}
              className={`flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                selectedModels.includes(model.id)
                  ? `border-${model.color}-500 bg-${model.color}-50 dark:bg-${model.color}-900/20`
                  : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedModels.includes(model.id)}
                onChange={() => handleModelToggle(model.id)}
                className={`rounded border-gray-300 text-${model.color}-600 focus:ring-${model.color}-500`}
              />
              <span className="text-sm font-medium text-gray-900 dark:text-white">{model.name}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={onRunComparison}
        disabled={!canRun}
        className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
          canRun
            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
            : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
        }`}
      >
        {isRunning ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Running Comparison...</span>
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            <span>Run Comparison</span>
          </>
        )}
      </button>
    </div>
  )
}
