"use client"

import { motion } from "framer-motion"
import { Zap, Shield, Users, Globe, QrCode, TrendingUp } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Instant Rewards",
    description: "Earn points the moment your referral makes a purchase. No waiting for billing cycles."
  },
  {
    icon: QrCode,
    title: "Dynamic QR Codes",
    description: "Generate unique, time-limited QR codes for any product to share with friends."
  },
  {
    icon: Shield,
    title: "AI Anti-Fraud",
    description: "Advanced ML algorithms detect and prevent commission abuse in real-time."
  },
  {
    icon: Users,
    title: "Network Growth",
    description: "Turn every customer into a micro-influencer for your local community."
  },
  {
    icon: Globe,
    title: "O2O Bridge",
    description: "Connect online sharing with offline purchases at any physical store."
  },
  {
    icon: TrendingUp,
    title: "Real-time Analytics",
    description: "Track your referral network performance with live dashboards."
  }
]

export function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02, y: -5 }}
          className="group p-6 bg-card border border-border rounded-2xl hover:border-primary/50 transition-colors cursor-pointer"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
            <feature.icon className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  )
}
