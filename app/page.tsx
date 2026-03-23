"use client"

import { motion } from "framer-motion"
import { PhoneMockup } from "@/components/phone-mockup"
import { Shield } from "lucide-react"

export default function PrototypePage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[120px]" />
      </div>

      {/* Logo */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-6"
      >
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">CipherShare</span>
        </div>
      </motion.header>

      {/* Centered Phone */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-4 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <PhoneMockup />
        </motion.div>
      </div>
    </main>
  )
}
