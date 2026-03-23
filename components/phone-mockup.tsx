"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  QrCode, 
  Share2, 
  Gift, 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  ChevronLeft,
  Check,
  Copy,
  Sparkles,
  Wallet,
  Bell,
  Home,
  Search,
  User,
  X,
  CheckCircle2,
  Clock,
  Eye,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Fingerprint,
  Smartphone,
  MapPin,
  AlertTriangle,
  Lock,
  Unlock,
  Activity
} from "lucide-react"
import { Button } from "@/components/ui/button"

type Screen = "home" | "products" | "share" | "rewards" | "network" | "profile" | "scan" | "security"

interface Product {
  id: number
  name: string
  price: number
  commission: number
  category: string
}

interface Referral {
  id: number
  name: string
  avatar: string
  status: "purchased" | "clicked" | "pending"
  points: number
  time: string
  product?: string
}

const products: Product[] = [
  { id: 1, name: "Premium Coffee", price: 89, commission: 12, category: "Drinks" },
  { id: 2, name: "Energy Drink", price: 35, commission: 5, category: "Drinks" },
  { id: 3, name: "Snack Box", price: 59, commission: 8, category: "Snacks" },
  { id: 4, name: "Ice Cream", price: 45, commission: 6, category: "Desserts" },
  { id: 5, name: "Sandwich", price: 65, commission: 9, category: "Food" },
  { id: 6, name: "Bottled Water", price: 15, commission: 2, category: "Drinks" },
]

const initialReferrals: Referral[] = [
  { id: 1, name: "Somchai", avatar: "S", status: "purchased", points: 45, time: "2 mins ago", product: "Premium Coffee" },
  { id: 2, name: "Ploy", avatar: "P", status: "clicked", points: 0, time: "5 mins ago", product: "Energy Drink" },
  { id: 3, name: "Bank", avatar: "B", status: "purchased", points: 89, time: "1 hour ago", product: "Snack Box" },
  { id: 4, name: "Mint", avatar: "M", status: "pending", points: 0, time: "2 hours ago" },
  { id: 5, name: "Nat", avatar: "N", status: "purchased", points: 35, time: "3 hours ago", product: "Energy Drink" },
]

const rewards = [
  { id: 1, name: "Free Coffee", points: 500, available: true },
  { id: 2, name: "10% Discount Coupon", points: 1000, available: true },
  { id: 3, name: "Mystery Box", points: 2000, available: true },
  { id: 4, name: "Free Delivery (1 month)", points: 3000, available: true },
]

// Deterministic QR code pattern based on product id
function generateQRPattern(productId: number): boolean[] {
  const seed = productId * 7919
  const pattern: boolean[] = []
  for (let i = 0; i < 81; i++) {
    const hash = ((seed + i) * 31) % 100
    pattern.push(hash > 40)
  }
  // Add corner markers
  const corners = [0, 1, 2, 6, 7, 8, 9, 18, 27, 36, 45, 54, 63, 72, 73, 74, 78, 79, 80, 71, 62, 53, 44, 35, 26, 17, 8]
  corners.forEach(i => { if (i < 81) pattern[i] = true })
  return pattern
}

export function PhoneMockup() {
  const [screen, setScreen] = useState<Screen>("home")
  const [previousScreen, setPreviousScreen] = useState<Screen>("home")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [linkCopied, setLinkCopied] = useState(false)
  const [totalPoints, setTotalPoints] = useState(1247)
  const [showReward, setShowReward] = useState(false)
  const [referrals, setReferrals] = useState(initialReferrals)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [notifications, setNotifications] = useState(3)
  const [redeemedRewards, setRedeemedRewards] = useState<number[]>([])
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [trustScore, setTrustScore] = useState(94)
  const [isDeviceVerified, setIsDeviceVerified] = useState(true)
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(true)
  const [securityAlerts, setSecurityAlerts] = useState([
    { id: 1, type: "info", message: "New device login blocked from Bangkok", time: "2 hours ago", resolved: false },
    { id: 2, type: "warning", message: "Unusual activity pattern detected", time: "1 day ago", resolved: true },
    { id: 3, type: "success", message: "2FA verification successful", time: "3 days ago", resolved: true },
  ])
  const [showBiometricModal, setShowBiometricModal] = useState(false)
  const [biometricVerifying, setBiometricVerifying] = useState(false)
  const [biometricSuccess, setBiometricSuccess] = useState(false)

  const categories = [...new Set(products.map(p => p.category))]

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const navigateTo = (newScreen: Screen) => {
    setPreviousScreen(screen)
    setScreen(newScreen)
  }

  const goBack = () => {
    if (screen === "share") {
      setScreen("products")
    } else {
      setScreen("home")
    }
  }

  const handleShare = (product: Product) => {
    setSelectedProduct(product)
    navigateTo("share")
  }

  const handleCopyLink = () => {
    setLinkCopied(true)
    setTimeout(() => {
      setLinkCopied(false)
      setShowReward(true)
      const earnedPoints = selectedProduct?.commission || 0
      setTotalPoints(prev => prev + earnedPoints)
      
      // Add new referral
      const newReferral: Referral = {
        id: Date.now(),
        name: "You",
        avatar: "Y",
        status: "clicked",
        points: 0,
        time: "Just now",
        product: selectedProduct?.name
      }
      setReferrals(prev => [newReferral, ...prev])
      
      setTimeout(() => setShowReward(false), 2500)
    }, 800)
  }

  const handleRedeemReward = (rewardId: number, rewardPoints: number, rewardName: string) => {
    if (totalPoints >= rewardPoints && !redeemedRewards.includes(rewardId)) {
      setTotalPoints(prev => prev - rewardPoints)
      setRedeemedRewards(prev => [...prev, rewardId])
      setNotificationMessage(`Redeemed: ${rewardName}`)
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 2000)
    }
  }

  const getStatusIcon = (status: Referral["status"]) => {
    switch (status) {
      case "purchased": return <CheckCircle2 className="w-4 h-4 text-primary" />
      case "clicked": return <Eye className="w-4 h-4 text-blue-400" />
      case "pending": return <Clock className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: Referral["status"]) => {
    switch (status) {
      case "purchased": return "bg-primary/20 text-primary"
      case "clicked": return "bg-blue-500/20 text-blue-400"
      case "pending": return "bg-muted text-muted-foreground"
    }
  }

  // Simulated live activity
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setNotifications(prev => prev + 1)
      }
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      {/* Phone Frame */}
      <div className="relative w-[340px] h-[700px] bg-foreground/5 rounded-[3rem] p-3 shadow-2xl shadow-primary/20 border border-border">
        {/* Inner screen */}
        <div className="relative w-full h-full bg-card rounded-[2.5rem] overflow-hidden">
          {/* Dynamic Island */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-background rounded-full z-50 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
          </div>
          
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-12 flex items-end justify-between px-8 pb-1 z-40">
            <span className="text-xs font-medium text-foreground">9:41</span>
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`w-1 ${i <= 3 ? 'bg-foreground' : 'bg-muted-foreground/30'}`} style={{height: `${8 + i * 2}px`}} />
                ))}
              </div>
              <div className="w-6 h-3 border border-foreground rounded-sm relative">
                <div className="absolute inset-0.5 right-1 bg-primary rounded-sm" />
                <div className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-0.5 h-1.5 bg-foreground rounded-r-full" />
              </div>
            </div>
          </div>

          {/* Screen Content */}
          <div className="pt-14 pb-20 h-full overflow-y-auto scrollbar-hide">
            <AnimatePresence mode="wait">
              {/* HOME SCREEN */}
              {screen === "home" && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="px-5 h-full"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-muted-foreground text-sm">Welcome back</p>
                      <h2 className="text-xl font-bold text-foreground">CipherShare</h2>
                    </div>
                    <motion.button
                      className="relative p-2 rounded-full bg-secondary/50"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setNotifications(0)
                        setNotificationMessage("All notifications cleared")
                        setShowNotification(true)
                        setTimeout(() => setShowNotification(false), 1500)
                      }}
                    >
                      <Bell className="w-5 h-5 text-foreground" />
                      {notifications > 0 && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary rounded-full text-[10px] font-bold text-primary-foreground flex items-center justify-center"
                        >
                          {notifications > 9 ? '9+' : notifications}
                        </motion.span>
                      )}
                    </motion.button>
                  </div>

                  {/* Points Card */}
                  <motion.div 
                    className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-5 mb-5"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Your Points</p>
                        <motion.p 
                          key={totalPoints}
                          initial={{ scale: 1.1, color: "hsl(var(--primary))" }}
                          animate={{ scale: 1, color: "hsl(var(--primary))" }}
                          className="text-4xl font-bold"
                        >
                          {totalPoints.toLocaleString()}
                        </motion.p>
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                        <Wallet className="w-7 h-7 text-primary" />
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-sm text-primary">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-medium">+156 this week</span>
                    </div>
                  </motion.div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-4 gap-2 mb-5">
                    {[
                      { icon: ShoppingBag, label: "Products", screen: "products" as Screen },
                      { icon: Gift, label: "Rewards", screen: "rewards" as Screen },
                      { icon: Shield, label: "Security", screen: "security" as Screen },
                      { icon: Users, label: "Network", screen: "network" as Screen },
                    ].map((item, i) => (
                      <motion.button
                        key={item.label}
                        onClick={() => navigateTo(item.screen)}
                        className="flex flex-col items-center gap-2 p-3 bg-secondary/50 rounded-xl border border-border hover:border-primary/50 transition-colors"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <item.icon className="w-5 h-5 text-primary" />
                        <span className="text-[11px] font-medium text-foreground">{item.label}</span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
                      <button 
                        onClick={() => navigateTo("network")}
                        className="text-xs text-primary font-medium"
                      >
                        View all
                      </button>
                    </div>
                    <div className="space-y-2">
                      {referrals.slice(0, 3).map((ref, i) => (
                        <motion.div
                          key={ref.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + i * 0.05 }}
                          className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl"
                        >
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-foreground">
                            {ref.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-foreground truncate">{ref.name}</p>
                              {getStatusIcon(ref.status)}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {ref.product || "Viewing products"} · {ref.time}
                            </p>
                          </div>
                          {ref.points > 0 && (
                            <span className="text-sm font-semibold text-primary">+{ref.points}</span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* PRODUCTS SCREEN */}
              {screen === "products" && (
                <motion.div
                  key="products"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="px-5 h-full"
                >
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={goBack}
                      className="p-2 rounded-full bg-secondary/50 text-foreground"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </motion.button>
                    <h2 className="text-lg font-bold text-foreground">Share Products</h2>
                  </div>

                  {/* Search */}
                  <div className="flex items-center gap-2 bg-secondary/50 rounded-xl px-3 py-2.5 mb-4 border border-border focus-within:border-primary/50 transition-colors">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="Search products..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery("")}>
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    )}
                  </div>

                  {/* Category Filter */}
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                        !selectedCategory 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-secondary/50 text-foreground border border-border"
                      }`}
                    >
                      All
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                          selectedCategory === cat 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-secondary/50 text-foreground border border-border"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Products List */}
                  <div className="space-y-3">
                    {filteredProducts.map((product, i) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl border border-border hover:border-primary/30 transition-colors"
                      >
                        <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.price} THB</p>
                          <div className="flex items-center gap-1 text-xs text-primary mt-0.5">
                            <Sparkles className="w-3 h-3" />
                            <span>Earn {product.commission} pts</span>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleShare(product)}
                          className="p-2.5 bg-primary rounded-xl text-primary-foreground shadow-lg shadow-primary/20"
                        >
                          <Share2 className="w-5 h-5" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* SHARE SCREEN */}
              {screen === "share" && selectedProduct && (
                <motion.div
                  key="share"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="px-5 h-full flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={goBack}
                      className="p-2 rounded-full bg-secondary/50 text-foreground"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </motion.button>
                    <h2 className="text-lg font-bold text-foreground">Share & Earn</h2>
                  </div>

                  {/* Product Preview */}
                  <motion.div 
                    className="text-center mb-5"
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                  >
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mb-3 border border-primary/20">
                      <ShoppingBag className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground text-lg">{selectedProduct.name}</h3>
                    <p className="text-muted-foreground">{selectedProduct.price} THB</p>
                  </motion.div>

                  {/* QR Code */}
                  <motion.div 
                    className="bg-secondary/30 rounded-2xl p-5 mb-4 border border-border relative"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {/* Security Badge */}
                    <motion.div 
                      className="absolute -top-2 -right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Lock className="w-3 h-3" />
                      Encrypted
                    </motion.div>
                    <div className="w-36 h-36 mx-auto bg-foreground rounded-xl p-2 mb-4 relative">
                      <div className="w-full h-full grid grid-cols-9 gap-px">
                        {generateQRPattern(selectedProduct.id).map((filled, i) => (
                          <div 
                            key={i} 
                            className={filled ? "bg-card" : "bg-foreground"}
                          />
                        ))}
                      </div>
                      {/* Center logo */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                          <ShieldCheck className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      <span>Anti-fraud protected QR code</span>
                    </div>
                  </motion.div>

                  {/* Referral Link */}
                  <motion.div 
                    className="bg-secondary/30 rounded-xl p-4 mb-4 border border-border"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-xs text-muted-foreground mb-2 font-medium">Your unique referral link</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs text-primary bg-secondary/50 px-3 py-2 rounded-lg truncate font-mono border border-border">
                        cipher.sh/r/{selectedProduct.id}x7k9m
                      </code>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleCopyLink}
                        disabled={linkCopied}
                        className={`p-2.5 rounded-lg transition-all ${
                          linkCopied 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-secondary border border-border text-foreground hover:border-primary/50"
                        }`}
                      >
                        {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Commission Info */}
                  <motion.div 
                    className="flex-1 flex items-center justify-center"
                    animate={showReward ? { scale: [1, 1.1, 1] } : {}}
                  >
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                      showReward 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-primary/10 text-primary"
                    } transition-colors`}>
                      <Sparkles className="w-5 h-5" />
                      <span className="font-medium">
                        {showReward 
                          ? `+${selectedProduct.commission} points earned!` 
                          : `Earn ${selectedProduct.commission} points per purchase`
                        }
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* REWARDS SCREEN */}
              {screen === "rewards" && (
                <motion.div
                  key="rewards"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="px-5 h-full"
                >
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={goBack}
                      className="p-2 rounded-full bg-secondary/50 text-foreground"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </motion.button>
                    <h2 className="text-lg font-bold text-foreground">Rewards</h2>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <motion.div 
                      className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-4 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <motion.p 
                        key={totalPoints}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        className="text-3xl font-bold text-primary"
                      >
                        {totalPoints.toLocaleString()}
                      </motion.p>
                      <p className="text-xs text-muted-foreground mt-1">Available Points</p>
                    </motion.div>
                    <motion.div 
                      className="bg-secondary/50 border border-border rounded-xl p-4 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                    >
                      <p className="text-3xl font-bold text-foreground">{referrals.filter(r => r.status === "purchased").length}</p>
                      <p className="text-xs text-muted-foreground mt-1">Successful Referrals</p>
                    </motion.div>
                  </div>

                  {/* Rewards List */}
                  <h3 className="text-sm font-semibold text-foreground mb-3">Available Rewards</h3>
                  <div className="space-y-3">
                    {rewards.map((reward, i) => {
                      const isRedeemed = redeemedRewards.includes(reward.id)
                      const canRedeem = totalPoints >= reward.points && !isRedeemed
                      
                      return (
                        <motion.div
                          key={reward.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + i * 0.05 }}
                          className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                            isRedeemed 
                              ? "bg-primary/10 border-primary/30" 
                              : "bg-secondary/30 border-border"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              isRedeemed ? "bg-primary/20" : "bg-secondary"
                            }`}>
                              <Gift className={`w-5 h-5 ${isRedeemed ? "text-primary" : "text-foreground"}`} />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{reward.name}</p>
                              <p className="text-xs text-muted-foreground">{reward.points.toLocaleString()} points</p>
                            </div>
                          </div>
                          <Button 
                            size="sm"
                            variant={isRedeemed ? "outline" : canRedeem ? "default" : "secondary"}
                            disabled={!canRedeem}
                            onClick={() => handleRedeemReward(reward.id, reward.points, reward.name)}
                            className="min-w-[80px]"
                          >
                            {isRedeemed ? (
                              <span className="flex items-center gap-1">
                                <Check className="w-3 h-3" /> Claimed
                              </span>
                            ) : "Redeem"}
                          </Button>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* NETWORK SCREEN */}
              {screen === "network" && (
                <motion.div
                  key="network"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="px-5 h-full"
                >
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={goBack}
                      className="p-2 rounded-full bg-secondary/50 text-foreground"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </motion.button>
                    <h2 className="text-lg font-bold text-foreground">Your Network</h2>
                  </div>

                  {/* Network Visualization */}
                  <motion.div 
                    className="relative h-44 bg-secondary/30 rounded-2xl mb-4 overflow-hidden border border-border"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        <motion.div 
                          className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm shadow-lg shadow-primary/30"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          You
                        </motion.div>
                        {referrals.slice(0, 6).map((ref, i) => {
                          const angle = (i * 60) * Math.PI / 180
                          const radius = 55
                          return (
                            <motion.div
                              key={ref.id}
                              className={`absolute w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold border-2 ${
                                ref.status === "purchased" 
                                  ? "bg-primary/20 border-primary text-primary" 
                                  : "bg-secondary border-border text-foreground"
                              }`}
                              style={{
                                left: `${Math.cos(angle) * radius - 4}px`,
                                top: `${Math.sin(angle) * radius - 4}px`,
                              }}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.2 + i * 0.08 }}
                            >
                              {ref.avatar}
                            </motion.div>
                          )
                        })}
                        {/* Connection lines */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ left: 7, top: 7 }}>
                          {referrals.slice(0, 6).map((ref, i) => {
                            const angle = (i * 60) * Math.PI / 180
                            const radius = 55
                            return (
                              <motion.line
                                key={ref.id}
                                x1="0"
                                y1="0"
                                x2={Math.cos(angle) * radius}
                                y2={Math.sin(angle) * radius}
                                stroke={ref.status === "purchased" ? "hsl(var(--primary))" : "hsl(var(--border))"}
                                strokeWidth="1"
                                strokeDasharray={ref.status === "purchased" ? "0" : "3,3"}
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ delay: 0.3 + i * 0.08, duration: 0.3 }}
                              />
                            )
                          })}
                        </svg>
                      </div>
                    </div>
                  </motion.div>

                  {/* Stats Summary */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { label: "Total", value: referrals.length, color: "text-foreground" },
                      { label: "Converted", value: referrals.filter(r => r.status === "purchased").length, color: "text-primary" },
                      { label: "Pending", value: referrals.filter(r => r.status !== "purchased").length, color: "text-muted-foreground" },
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.05 }}
                        className="bg-secondary/30 rounded-xl p-3 text-center border border-border"
                      >
                        <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                        <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Referrals List */}
                  <h3 className="text-sm font-semibold text-foreground mb-3">All Referrals</h3>
                  <div className="space-y-2">
                    {referrals.map((ref, i) => (
                      <motion.div
                        key={ref.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.03 }}
                        className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl border border-border"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-foreground">
                          {ref.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm">{ref.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{ref.product || "Browsing"} · {ref.time}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] px-2 py-1 rounded-full ${getStatusColor(ref.status)}`}>
                            {ref.status}
                          </span>
                          {ref.points > 0 && (
                            <p className="text-xs text-primary font-semibold mt-1">+{ref.points}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* SCAN SCREEN */}
              {screen === "scan" && (
                <motion.div
                  key="scan"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="px-5 h-full flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={goBack}
                      className="p-2 rounded-full bg-secondary/50 text-foreground"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </motion.button>
                    <h2 className="text-lg font-bold text-foreground">Scan QR Code</h2>
                  </div>

                  {/* Scanner View */}
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <motion.div 
                      className="w-56 h-56 border-2 border-primary rounded-3xl relative mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {/* Corner markers */}
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
                      
                      {/* Scanning line animation */}
                      <motion.div 
                        className="absolute left-4 right-4 h-0.5 bg-primary"
                        initial={{ top: 16 }}
                        animate={{ top: [16, 200, 16] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      />
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                        <QrCode className="w-16 h-16 text-muted-foreground/30" />
                      </div>
                    </motion.div>
                    
                    <p className="text-center text-muted-foreground text-sm">
                      Position the QR code within the frame
                    </p>
                    <p className="text-center text-muted-foreground text-xs mt-1">
                      to scan and earn rewards
                    </p>
                  </div>
                </motion.div>
              )}

              {/* PROFILE SCREEN */}
              {screen === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="px-5 h-full"
                >
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={goBack}
                      className="p-2 rounded-full bg-secondary/50 text-foreground"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </motion.button>
                    <h2 className="text-lg font-bold text-foreground">Profile</h2>
                  </div>

                  {/* Profile Card */}
                  <motion.div 
                    className="text-center mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center mb-3 border-2 border-primary/30">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground text-lg">CipherShare User</h3>
                    <p className="text-sm text-muted-foreground">Member since 2024</p>
                  </motion.div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-secondary/30 rounded-xl p-4 text-center border border-border">
                      <p className="text-2xl font-bold text-primary">{totalPoints.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Total Points</p>
                    </div>
                    <div className="bg-secondary/30 rounded-xl p-4 text-center border border-border">
                      <p className="text-2xl font-bold text-foreground">{referrals.length}</p>
                      <p className="text-xs text-muted-foreground">Referrals</p>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-2">
                    {[
                      { label: "Edit Profile", action: null },
                      { label: "Security Center", action: () => navigateTo("security") },
                      { label: "Help & Support", action: null },
                      { label: "Terms of Service", action: null }
                    ].map((item, i) => (
                      <motion.button
                        key={item.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.05 }}
                        onClick={item.action || undefined}
                        className="w-full flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border hover:border-primary/30 transition-colors"
                      >
                        <span className="text-foreground flex items-center gap-2">
                          {item.label === "Security Center" && <Shield className="w-4 h-4 text-primary" />}
                          {item.label}
                        </span>
                        <ChevronLeft className="w-4 h-4 text-muted-foreground rotate-180" />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* SECURITY SCREEN */}
              {screen === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="px-5 h-full"
                >
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setScreen("profile")}
                      className="p-2 rounded-full bg-secondary/50 text-foreground"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </motion.button>
                    <h2 className="text-lg font-bold text-foreground">Security Center</h2>
                  </div>

                  {/* Trust Score Card */}
                  <motion.div 
                    className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-5 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Trust Score</p>
                        <div className="flex items-center gap-2">
                          <motion.p 
                            className="text-4xl font-bold text-primary"
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                          >
                            {trustScore}
                          </motion.p>
                          <span className="text-lg text-muted-foreground">/100</span>
                        </div>
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                        <ShieldCheck className="w-7 h-7 text-primary" />
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${trustScore}%` }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                      />
                    </div>
                    <p className="text-xs text-primary mt-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Excellent - Account fully protected
                    </p>
                  </motion.div>

                  {/* Security Features */}
                  <div className="space-y-3 mb-4">
                    {/* Device Verification */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDeviceVerified ? 'bg-primary/20' : 'bg-destructive/20'}`}>
                          <Smartphone className={`w-5 h-5 ${isDeviceVerified ? 'text-primary' : 'text-destructive'}`} />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">Device Verified</p>
                          <p className="text-xs text-muted-foreground">iPhone 15 Pro</p>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${isDeviceVerified ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'}`}>
                        {isDeviceVerified ? 'Trusted' : 'Unverified'}
                      </div>
                    </motion.div>

                    {/* Biometric Auth */}
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                      onClick={() => {
                        setShowBiometricModal(true)
                        setBiometricVerifying(true)
                        setBiometricSuccess(false)
                        setTimeout(() => {
                          setBiometricVerifying(false)
                          setBiometricSuccess(true)
                          setTimeout(() => {
                            setShowBiometricModal(false)
                            setIsBiometricEnabled(!isBiometricEnabled)
                            setNotificationMessage(isBiometricEnabled ? "Biometric disabled" : "Biometric enabled")
                            setShowNotification(true)
                            setTimeout(() => setShowNotification(false), 1500)
                          }, 800)
                        }, 1500)
                      }}
                      className="w-full flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isBiometricEnabled ? 'bg-primary/20' : 'bg-secondary'}`}>
                          <Fingerprint className={`w-5 h-5 ${isBiometricEnabled ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-foreground text-sm">Biometric Login</p>
                          <p className="text-xs text-muted-foreground">Face ID / Touch ID</p>
                        </div>
                      </div>
                      <div className={`w-12 h-7 rounded-full p-1 transition-colors ${isBiometricEnabled ? 'bg-primary' : 'bg-secondary'}`}>
                        <motion.div 
                          className="w-5 h-5 rounded-full bg-foreground"
                          animate={{ x: isBiometricEnabled ? 20 : 0 }}
                        />
                      </div>
                    </motion.button>

                    {/* Location Tracking */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">Location Guard</p>
                          <p className="text-xs text-muted-foreground">Bangkok, Thailand</p>
                        </div>
                      </div>
                      <div className="px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                        Active
                      </div>
                    </motion.div>

                    {/* Anti-Fraud Engine */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 }}
                      className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                          <Activity className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">Anti-Fraud Engine</p>
                          <p className="text-xs text-muted-foreground">Real-time monitoring</p>
                        </div>
                      </div>
                      <motion.div 
                        className="flex gap-0.5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {[1,2,3].map(i => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-4 bg-primary rounded-full"
                            animate={{ scaleY: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                          />
                        ))}
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Security Alerts */}
                  <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-muted-foreground" />
                    Recent Alerts
                  </h3>
                  <div className="space-y-2">
                    {securityAlerts.map((alert, i) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        className={`p-3 rounded-xl border ${
                          alert.resolved 
                            ? 'bg-secondary/20 border-border' 
                            : 'bg-destructive/10 border-destructive/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            alert.resolved ? 'bg-primary/20' : 'bg-destructive/20'
                          }`}>
                            {alert.resolved 
                              ? <CheckCircle2 className="w-4 h-4 text-primary" />
                              : <AlertTriangle className="w-4 h-4 text-destructive" />
                            }
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-foreground">{alert.message}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{alert.time}</p>
                          </div>
                          {!alert.resolved && (
                            <button
                              onClick={() => {
                                setSecurityAlerts(prev => 
                                  prev.map(a => a.id === alert.id ? {...a, resolved: true} : a)
                                )
                                setTrustScore(prev => Math.min(100, prev + 2))
                                setNotificationMessage("Alert resolved")
                                setShowNotification(true)
                                setTimeout(() => setShowNotification(false), 1500)
                              }}
                              className="text-xs text-primary font-medium"
                            >
                              Resolve
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Navigation */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-card/95 backdrop-blur-sm border-t border-border flex items-center justify-around px-2 pb-2">
            {[
              { icon: Home, label: "Home", target: "home" as Screen },
              { icon: ShoppingBag, label: "Products", target: "products" as Screen },
              { icon: QrCode, label: "Scan", target: "scan" as Screen, special: true },
              { icon: Gift, label: "Rewards", target: "rewards" as Screen },
              { icon: User, label: "Profile", target: "profile" as Screen },
            ].map((item) => (
              <motion.button
                key={item.label}
                onClick={() => navigateTo(item.target)}
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
                  item.special 
                    ? "bg-primary text-primary-foreground -mt-4 px-4 py-3 shadow-lg shadow-primary/30" 
                    : screen === item.target 
                      ? "text-primary" 
                      : "text-muted-foreground"
                }`}
              >
                <item.icon className={item.special ? "w-6 h-6" : "w-5 h-5"} />
                {!item.special && <span className="text-[10px] font-medium">{item.label}</span>}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Reward Animation Overlay */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold text-xl shadow-2xl shadow-primary/40 flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              +{selectedProduct?.commission} Points!
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-4 left-4 right-4 bg-secondary border border-border text-foreground px-4 py-3 rounded-xl text-sm font-medium text-center shadow-lg"
          >
            {notificationMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Biometric Modal */}
      <AnimatePresence>
        {showBiometricModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-[2.5rem]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-card border border-border rounded-2xl p-6 mx-8 text-center"
            >
              <motion.div 
                className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
                  biometricSuccess ? 'bg-primary/20' : 'bg-secondary'
                }`}
                animate={biometricVerifying ? { scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: biometricVerifying ? Infinity : 0, duration: 1 }}
              >
                {biometricSuccess ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                  </motion.div>
                ) : (
                  <Fingerprint className={`w-10 h-10 ${biometricVerifying ? 'text-primary' : 'text-muted-foreground'}`} />
                )}
              </motion.div>
              <h3 className="font-bold text-foreground text-lg mb-1">
                {biometricSuccess ? 'Verified' : biometricVerifying ? 'Verifying...' : 'Touch Sensor'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {biometricSuccess 
                  ? 'Biometric authentication successful'
                  : 'Place your finger on the sensor'
                }
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
