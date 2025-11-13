"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, ArrowLeft, TrendingUp, TrendingDown, Minus, Download, Award, Clock } from "lucide-react"
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

interface AssessmentData {
  score: number
  level: "Low" | "Moderate" | "High"
  recommendations: string[]
  breakdown: Record<string, number>
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

export default function DashboardPage() {
  const [data, setData] = useState<AssessmentData | null>(null)
  const [mintedBadge, setMintedBadge] = useState<{
    id: string
    timestamp: string
    network: string
  } | null>(null)

  useEffect(() => {
    // Get assessment answers
    const answersStr = localStorage.getItem("assessmentAnswers")
    const behaviorStr = localStorage.getItem("behaviorData")

    if (!answersStr) {
      // No assessment data, redirect
      window.location.href = "/assessment"
      return
    }

    const answers = JSON.parse(answersStr)
    const behavior = behaviorStr ? JSON.parse(behaviorStr) : null

    // Calculate score
    let score = 0
    const breakdown: Record<string, number> = {}

    Object.entries(answers).forEach(([key, value]) => {
      const numValue = Number.parseInt(value as string)
      score += numValue
      breakdown[key] = numValue
    })

    // Add behavior penalty if drop > 30%
    if (behavior) {
      const avgBehavior = Object.values(behavior).reduce((a: any, b: any) => a + b, 0) / 5
      if (avgBehavior < 50) {
        score += 2
      }
    }

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
        "Seek professional mental health support",
        "Contact a therapist or counselor soon",
        "Reach out to trusted friends or family",
        "Call a mental health helpline if needed",
        "Avoid isolation - stay connected",
        "Consider support groups",
      ]
    }

    setData({ score, level, recommendations, breakdown })
  }, [])

  const handleExportPDF = async () => {
    if (!data) return

    try {
      // Create a printable version
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
            .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
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

          <div class="footer">
            <p><strong>Disclaimer:</strong> This report is for informational purposes only and does not constitute medical advice. Please consult with a qualified healthcare professional for proper diagnosis and treatment.</p>
            <p>© 2025 MindTrack - Mental Wellbeing Monitoring System</p>
          </div>
        </body>
        </html>
      `

      printWindow.document.write(html)
      printWindow.document.close()

      // Wait for content to load then trigger print
      setTimeout(() => {
        printWindow.print()
      }, 250)
    } catch (error) {
      alert("Unable to generate PDF. Please try again.")
    }
  }

  const handleMintBadge = () => {
    // Simulate blockchain minting with realistic details
    const badgeId = `APTOS-${Date.now().toString(36).toUpperCase()}`
    const badge = {
      id: badgeId,
      timestamp: new Date().toISOString(),
      network: "Aptos Testnet",
    }

    setMintedBadge(badge)

    // Store in localStorage for persistence
    localStorage.setItem("aptosGadge", JSON.stringify(badge))
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

  // Chart data
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
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              MindTrack
            </span>
          </Link>
          <div className="hidden md:block">
            <LiveClock />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Health Monitor Dashboard</h1>
          <p className="text-muted-foreground">Your comprehensive mental wellbeing overview</p>
        </div>

        {/* Alert for High Risk */}
        {data.level === "High" && (
          <Card className="mb-6 border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-destructive mb-1">Important Notice</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your assessment indicates elevated stress levels. We strongly recommend speaking with a mental
                    health professional. If you're experiencing a crisis, please contact emergency services or a mental
                    health helpline immediately.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Stats */}
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
              <CardDescription>Achievement</CardDescription>
              <CardTitle>Check-in Complete</CardTitle>
            </CardHeader>
            <CardContent>
              {!mintedBadge ? (
                <Button onClick={handleMintBadge} className="w-full bg-transparent" variant="outline">
                  <Award className="w-4 h-4 mr-2" />
                  Mint Aptos Badge
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-success text-sm font-medium">
                    <Award className="w-4 h-4" />
                    <span>Badge Minted!</span>
                  </div>
                  <div className="text-xs space-y-1 text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <div>
                      <strong>ID:</strong> {mintedBadge.id}
                    </div>
                    <div>
                      <strong>Network:</strong> {mintedBadge.network}
                    </div>
                    <div>
                      <strong>Time:</strong> {new Date(mintedBadge.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Trend Chart */}
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

          {/* Radar Chart */}
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

        {/* Category Breakdown */}
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

        {/* Recommendations */}
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
