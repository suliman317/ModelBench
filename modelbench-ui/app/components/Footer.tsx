"use client"

import { motion } from "framer-motion"
import { Heart, Github, Twitter, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex items-center justify-center space-x-2 text-slate-400 mb-6">
            <span>Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            >
              <Heart className="w-5 h-5 text-red-400" />
            </motion.div>
            <span>by Your Name</span>
            <span className="text-slate-600">|</span>
            <span>MIT Licensed</span>
          </div>

          <div className="flex items-center justify-center space-x-6 mb-8">
            <motion.a
              whileHover={{ scale: 1.1, y: -2 }}
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all border border-slate-700/30"
            >
              <Github className="w-5 h-5" />
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.1, y: -2 }}
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-blue-400 transition-all border border-slate-700/30"
            >
              <Twitter className="w-5 h-5" />
            </motion.a>

            <motion.a
              whileHover={{ scale: 1.1, y: -2 }}
              href="mailto:hello@example.com"
              className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-green-400 transition-all border border-slate-700/30"
            >
              <Mail className="w-5 h-5" />
            </motion.a>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 rounded-xl border border-blue-500/30 text-blue-300 hover:text-blue-200 transition-all"
          >
            Send Feedback
          </motion.button>
        </motion.div>
      </div>
    </footer>
  )
}
