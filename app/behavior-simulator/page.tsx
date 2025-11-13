"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, ArrowLeft, Sparkles, Activity } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function BehaviorSimulatorPage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)

  const generateBehaviorData = () => {
    setIsGenerating(true)
    setProgress(0)

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          // Generate random behavior data
          const behaviorData = {
            activityLevel: Math.floor(Math.random() * 100),
            socialInteraction: Math.floor(Math.random() * 100),
            screenTime: Math.floor(Math.random() * 100),
            physicalActivity: Math.floor(Math.random() * 100),
            sleepDuration: Math.floor(Math.random() * 100),
          }
          localStorage.setItem("behaviorData", JSON.stringify(behaviorData))

          setTimeout(() => {
            router.push("/dashboard")
          }, 500)
          return 100
        }
        return prev + 10
      })
    }, 150)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              MindTrack
            </span>
          </Link>
          <Link href="/assessment">
            <Button variant="ghost" size="sm" disabled={isGenerating}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-balance">Behavioral Analysis</h1>
            <p className="text-muted-foreground">Generate behavioral data for comprehensive wellbeing assessment</p>
          </div>

          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 mx-auto">
                <Activity className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-center text-xl">Generate Behavior Data</CardTitle>
              <CardDescription className="text-center">
                Click below to simulate behavioral patterns analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-6 space-y-3">
                <h3 className="font-semibold text-sm">What we analyze:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-chart-1" />
                    Activity level patterns
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-chart-2" />
                    Social interaction frequency
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-chart-3" />
                    Screen time and digital wellness
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-chart-4" />
                    Physical activity metrics
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-chart-5" />
                    Sleep duration and quality
                  </li>
                </ul>
              </div>

              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Analyzing patterns...</span>
                    <span className="text-primary font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              <Button onClick={generateBehaviorData} disabled={isGenerating} className="w-full" size="lg">
                {isGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Behavior Data
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
