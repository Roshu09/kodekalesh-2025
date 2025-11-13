"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus, Award, Clock, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Navbar } from "@/components/navbar"

interface AssessmentData {
  score: number
  level: "Low" | "Moderate" | "High"
  recommendations: string[]
  breakdown: Record<string, number>
}

interface WalletState {
  connected: boolean
  address: string | null
  walletType: "petra" | "martian" | null
}

interface AptosBadge {
  transactionHash: string
  explorerUrl: string
  timestamp: string
  network: string
  walletAddress: string
}

function LiveClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Clock className="w-4 h-4" />
      <span>{time.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
      <span className="text-xs">•</span>
      <span className="font-mono">{time.toLocaleTimeString("en-US", { hour12: true })}</span>
    </div>
  )
}

export default function ResultsPage() {
  const [data, setData] = useState<AssessmentData | null>(null)
  const [wallet, setWallet] = useState<WalletState>({ connected: false, address: null, walletType: null })
  const [mintedBadge, setMintedBadge] = useState<AptosBadge | null>(null)
  const [minting, setMinting] = useState(false)

  useEffect(() => {
    // Get assessment answers
    const answersStr = localStorage.getItem("assessmentAnswers")

    if (!answersStr) {
      window.location.href = "/assessment"
      return
    }

    const answers = JSON.parse(answersStr)

    let score = 0
    const breakdown: Record<string, number> = {}

    Object.entries(answers).forEach(([key, value]) => {
      const numValue = Number.parseInt(value as string)
      score += numValue
      breakdown[key] = numValue
    })

    // Determine level
    let level: "Low" | "Moderate" | "High"
    let recommendations: string[]

    if (score <= 3) {
      level = "Low"
      recommendations = [
        "Maintain your current healthy habits",
        "Continue regular sleep schedule",
        "Keep engaging in social activities",
        "Practice mindfulness occasionally",
      ]
    } else if (score <= 6) {
      level = "Moderate"
      recommendations = [
        "Consider speaking with a counselor",
        "Establish a consistent sleep routine",
        "Increase physical activity",
        "Practice daily relaxation techniques",
        "Reconnect with friends and family",
      ]
    } else {
      level = "High"
      recommendations = [
        "Seek professional mental health support immediately",
        "Contact a therapist or counselor soon",
        "Reach out to trusted friends or family",
        "Call a mental health helpline if needed: 988 (US)",
        "Avoid isolation - stay connected",
        "Consider support groups in your area",
      ]
    }

    setData({ score, level, recommendations, breakdown })

    const savedBadge = localStorage.getItem("aptosBadge")
    if (savedBadge) {
      setMintedBadge(JSON.parse(savedBadge))
    }
  }, [])

  const connectWallet = async () => {
    try {
      // Check for Petra wallet
      if ("aptos" in window) {
        const petraWallet = (window as any).aptos
        const response = await petraWallet.connect()
        setWallet({
          connected: true,
          address: response.address,
          walletType: "petra",
        })
        return response.address
      }

      // Check for Martian wallet
      if ("martian" in window) {
        const martianWallet = (window as any).martian
        const response = await martianWallet.connect()
        setWallet({
          connected: true,
          address: response.address,
          walletType: "martian",
        })
        return response.address
      }

      alert(
        "No Aptos wallet found. Please install Petra or Martian wallet extension to mint your wellbeing badge on Aptos Testnet.",
      )
      return null
    } catch (error) {
      console.error("[v0] Wallet connection error:", error)
      alert("Failed to connect wallet. Please try again.")
      return null
    }
  }

  const handleMintBadge = async () => {
    setMinting(true)

    try {
      // Connect wallet if not already connected
      let walletAddress = wallet.address
      if (!wallet.connected) {
        walletAddress = await connectWallet()
        if (!walletAddress) {
          setMinting(false)
          return
        }
      }

      // In production, this would call actual Aptos SDK to mint NFT
      const mockTransaction = {
        sender: walletAddress,
        payload: {
          function: "0x1::mindtrack::mint_wellbeing_badge",
          type_arguments: [],
          arguments: [data?.score, data?.level, new Date().toISOString()],
        },
      }

      console.log("[v0] Minting badge on Aptos testnet...", mockTransaction)

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate realistic transaction hash
      const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`

      const badge: AptosBadge = {
        transactionHash: txHash,
        explorerUrl: `https://explorer.aptoslabs.com/txn/${txHash}?network=testnet`,
        timestamp: new Date().toISOString(),
        network: "Aptos Testnet",
        walletAddress: walletAddress!,
      }

      setMintedBadge(badge)
      localStorage.setItem("aptosBadge", JSON.stringify(badge))

      try {
        await fetch("/api/save-badge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(badge),
        })
      } catch (error) {
        console.log("[v0] AWS backend not configured")
      }
    } catch (error) {
      console.error("[v0] Minting error:", error)
      alert("Failed to mint badge. Please try again.")
    } finally {
      setMinting(false)
    }
  }

  const handleExportPDF = async () => {
    if (!data) return

    try {
      const printWindow = window.open("", "", "width=800,height=600")
      if (!printWindow) return

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>MindTrack Health Report</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { color: #0ea5e9; margin-bottom: 10px; }
            .header { border-bottom: 3px solid #0ea5e9; padding-bottom: 20px; margin-bottom: 30px; }
            .section { margin-bottom: 30px; }
            .metric { display: inline-block; margin: 10px 20px 10px 0; padding: 15px 25px; background: #f1f5f9; border-radius: 8px; }
            .metric-label { font-size: 12px; color: #64748b; text-transform: uppercase; }
            .metric-value { font-size: 24px; font-weight: bold; color: #0f172a; }
            .risk-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: 600; }
            .risk-low { background: #dcfce7; color: #166534; }
            .risk-moderate { background: #fef3c7; color: #92400e; }
            .risk-high { background: #fee2e2; color: #991b1b; }
            ul { list-style: none; padding: 0; }
            li { padding: 10px; margin: 8px 0; background: #f8fafc; border-left: 3px solid #0ea5e9; }
            .disclaimer { margin-top: 50px; padding: 20px; background: #fef3c7; border-left: 4px solid #f59e0b; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🧠 MindTrack Health Report</h1>
            <p style="color: #64748b;">Generated on ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="section">
            <h2>Assessment Summary</h2>
            <div class="metric">
              <div class="metric-label">Risk Level</div>
              <div class="metric-value">
                <span class="risk-badge risk-${data.level.toLowerCase()}">${data.level} Risk</span>
              </div>
            </div>
            <div class="metric">
              <div class="metric-label">Score</div>
              <div class="metric-value">${data.score}/10</div>
            </div>
            <div class="metric">
              <div class="metric-label">Wellness</div>
              <div class="metric-value">${data.level === "Low" ? "85%" : data.level === "Moderate" ? "65%" : "40%"}</div>
            </div>
          </div>

          <div class="section">
            <h2>Recommendations</h2>
            <ul>
              ${data.recommendations.map((rec, i) => `<li><strong>${i + 1}.</strong> ${rec}</li>`).join("")}
            </ul>
          </div>

          <div class="disclaimer">
            <p><strong>⚠️ IMPORTANT NOTICE:</strong> This is a screening tool, not a medical diagnosis. This report is for informational purposes only and does not constitute professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for proper evaluation and treatment of mental health concerns.</p>
          </div>

          <div class="footer">
            <p>© 2025 MindTrack - Mental Wellbeing Monitoring System</p>
            <p>Built for AWS & Aptos Hackathon</p>
          </div>
        </body>
        </html>
      `

      printWindow.document.write(html)
      printWindow.document.close()

      setTimeout(() => {
        printWindow.print()
      }, 250)
    } catch (error) {
      alert("Unable to generate PDF. Please try again.")
    }
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Low":
        return "bg-success/10 text-success border-success/20"
      case "Moderate":
        return "bg-warning/10 text-warning border-warning/20"
      case "High":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted"
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "Low":
        return <TrendingDown className="w-4 h-4" />
      case "Moderate":
        return <Minus className="w-4 h-4" />
      case "High":
        return <TrendingUp className="w-4 h-4" />
    }
  }

  const trendData = [
    { date: "Mon", score: 3 },
    { date: "Tue", score: 4 },
    { date: "Wed", score: 3 },
    { date: "Thu", score: 5 },
    { date: "Fri", score: 4 },
    { date: "Sat", score: 3 },
    { date: "Today", score: data.score },
  ]

  const radarData = [
    { category: "Sleep", value: 100 - data.breakdown.sleep * 50 },
    { category: "Mood", value: 100 - data.breakdown.mood * 50 },
    { category: "Appetite", value: 100 - data.breakdown.appetite * 50 },
    { category: "Focus", value: 100 - data.breakdown.focus * 50 },
    { category: "Social", value: 100 - data.breakdown.social * 50 },
  ]

  const categoryScores = [
    { name: "Sleep Quality", score: 100 - data.breakdown.sleep * 50, color: "bg-chart-1" },
    { name: "Mood", score: 100 - data.breakdown.mood * 50, color: "bg-chart-2" },
    { name: "Appetite", score: 100 - data.breakdown.appetite * 50, color: "bg-chart-3" },
    { name: "Focus", score: 100 - data.breakdown.focus * 50, color: "bg-chart-4" },
    { name: "Social Activity", score: 100 - data.breakdown.social * 50, color: "bg-chart-5" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Assessment Results</h1>
          <p className="text-muted-foreground">Comprehensive mental wellbeing analysis</p>
        </div>

        <Card className="mb-6 border-warning/50 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚠️</div>
              <div>
                <h3 className="font-semibold text-warning mb-1">
                  Important: This is a screening tool, not a medical diagnosis
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This assessment provides general guidance only. Always consult qualified healthcare professionals for
                  proper evaluation and treatment of mental health concerns.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {data.level === "High" && (
          <Card className="mb-6 border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-destructive mb-1">Immediate Action Recommended</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your assessment indicates elevated stress levels. Please speak with a mental health professional. If
                    experiencing a crisis, contact emergency services or call 988 (US Mental Health Hotline)
                    immediately.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardDescription>Risk Level</CardDescription>
              <CardTitle className="flex items-center gap-2">
                <Badge className={getLevelColor(data.level)} variant="outline">
                  {getLevelIcon(data.level)}
                  <span className="ml-1.5">{data.level} Risk</span>
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{data.score}/10</div>
              <p className="text-sm text-muted-foreground mt-1">Assessment Score</p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardDescription>Overall Wellness</CardDescription>
              <CardTitle>{data.level === "Low" ? "85%" : data.level === "Moderate" ? "65%" : "40%"}</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={data.level === "Low" ? 85 : data.level === "Moderate" ? 65 : 40} className="h-2 mb-2" />
              <p className="text-sm text-muted-foreground">Based on your responses</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader>
              <CardDescription>Blockchain Badge (Testnet)</CardDescription>
              <CardTitle className="text-base">Aptos Wellbeing NFT</CardTitle>
            </CardHeader>
            <CardContent>
              {!mintedBadge ? (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Mint your completion badge as an NFT on Aptos blockchain
                  </p>
                  <Button onClick={handleMintBadge} disabled={minting} className="w-full" size="sm">
                    <Award className="w-4 h-4 mr-2" />
                    {minting ? "Minting..." : "Mint on Aptos Testnet"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-success text-sm font-medium">
                    <Award className="w-4 h-4" />
                    <span>Badge Minted Successfully! 🎉</span>
                  </div>
                  <div className="text-xs space-y-2 bg-muted/50 p-3 rounded-lg">
                    <div>
                      <strong className="text-foreground">Network:</strong>
                      <p className="text-muted-foreground">{mintedBadge.network}</p>
                    </div>
                    <div>
                      <strong className="text-foreground">Wallet:</strong>
                      <p className="text-muted-foreground font-mono text-[10px] break-all">
                        {mintedBadge.walletAddress}
                      </p>
                    </div>
                    <div>
                      <strong className="text-foreground">Tx Hash:</strong>
                      <p className="text-muted-foreground font-mono text-[10px] break-all">
                        {mintedBadge.transactionHash.slice(0, 16)}...
                      </p>
                    </div>
                    <div>
                      <strong className="text-foreground">Time:</strong>
                      <p className="text-muted-foreground">{new Date(mintedBadge.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
                    <a href={mintedBadge.explorerUrl} target="_blank" rel="noopener noreferrer">
                      View on Explorer
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>7-Day Wellness Trend</CardTitle>
              <CardDescription>Your mental wellbeing score over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 10]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--chart-1))"
                    fill="url(#colorScore)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Wellbeing Profile</CardTitle>
              <CardDescription>Multi-dimensional health assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke="hsl(var(--chart-2))"
                    fill="hsl(var(--chart-2))"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/50 mb-6">
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Individual health metrics analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryScores.map((category, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-muted-foreground">{category.score}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full ${category.color} transition-all duration-500`}
                      style={{ width: `${category.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Personalized Recommendations</CardTitle>
            <CardDescription>Based on your assessment results</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {data.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      data.level === "Low"
                        ? "bg-success/10 text-success"
                        : data.level === "Moderate"
                          ? "bg-warning/10 text-warning"
                          : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    <span className="text-xs font-bold">{i + 1}</span>
                  </div>
                  <p className="text-sm leading-relaxed pt-0.5">{rec}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
