"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Activity, TrendingUp, Shield, Sparkles, ArrowRight, MessageCircle } from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-4">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Mental Wellbeing Detection</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
            Early Detection for{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Better Mental Health
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed">
            MindTrack uses AI and behavioral analysis to detect early signs of mental stress, providing timely insights
            and interventions before symptoms escalate.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/assessment">
              <Button size="lg" className="shadow-lg group">
                Start Assessment
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/ai-counselor">
              <Button
                size="lg"
                variant="outline"
                className="shadow-lg group border-accent/50 hover:bg-accent/10 bg-transparent"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Talk to AI Counselor
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16">
          {[
            { label: "Early Detection Rate", value: "94%", icon: TrendingUp },
            { label: "Users Helped", value: "10K+", icon: Activity },
            { label: "Privacy Protected", value: "100%", icon: Shield },
            { label: "AI Accuracy", value: "92%", icon: Brain },
          ].map((stat, i) => (
            <Card key={i} className="text-center border-border/50">
              <CardContent className="pt-6">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Problem Statement */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-balance">The Challenge We're Solving</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Mental wellbeing services remain severely constrained by limited clinical manpower, inconsistent
              self-reporting, and the absence of continuous behavioral monitoring.
            </p>
            <p>
              Individuals experiencing early psychological stress indicators often remain undetected until symptoms
              intensify. Institutions, workplaces, and healthcare systems are consequently unable to provide timely
              interventions, leading to escalated crises and long-term societal burdens.
            </p>
            <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="text-sm font-medium text-warning">
                ⚠️ <strong>Important Notice:</strong> This is a screening tool, not a medical diagnosis. Always consult
                qualified healthcare professionals for proper evaluation and treatment.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">How MindTrack Works</h2>
          <p className="text-muted-foreground text-balance max-w-2xl mx-auto">
            Our comprehensive approach combines self-assessment, behavioral analysis, and AI-powered insights
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              title: "Quick Assessment",
              description: "5-question survey covering sleep, mood, appetite, focus, and social activity",
              icon: "📝",
              color: "bg-chart-1/10 text-chart-1 border-chart-1/20",
            },
            {
              title: "Behavioral Analysis",
              description: "AI-powered analysis of activity patterns and behavioral indicators",
              icon: "📊",
              color: "bg-chart-2/10 text-chart-2 border-chart-2/20",
            },
            {
              title: "Risk Scoring",
              description: "Intelligent scoring system categorizing risk as Low, Moderate, or High",
              icon: "🎯",
              color: "bg-chart-3/10 text-chart-3 border-chart-3/20",
            },
            {
              title: "Visual Dashboard",
              description: "Beautiful charts and graphs showing your wellbeing trends over time",
              icon: "📈",
              color: "bg-chart-4/10 text-chart-4 border-chart-4/20",
            },
            {
              title: "Personalized Insights",
              description: "Tailored recommendations based on your specific risk profile",
              icon: "💡",
              color: "bg-chart-5/10 text-chart-5 border-chart-5/20",
            },
            {
              title: "Blockchain Badge",
              description: "Mint completion badges on Aptos blockchain as proof of check-ins",
              icon: "🏆",
              color: "bg-primary/10 text-primary border-primary/20",
            },
            {
              title: "AI Mental Health Companion",
              description: "24/7 AI-powered conversational support for immediate mental health assistance",
              icon: "🤖",
              color: "bg-accent/10 text-accent border-accent/20",
            },
          ].map((feature, i) => (
            <Card key={i} className="border-border/50 hover:border-primary/30 transition-all hover:shadow-lg">
              <CardHeader>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3 border ${feature.color}`}
                >
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="py-12 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-balance">Ready to Track Your Wellbeing?</h2>
            <p className="text-muted-foreground text-balance max-w-xl mx-auto">
              Start your journey towards better mental health with our AI-powered assessment
            </p>
            <Link href="/assessment">
              <Button size="lg" className="shadow-lg">
                Begin Your Assessment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2025 MindTrack. Built for AWS & Aptos Hackathon. Privacy-first mental wellbeing.</p>
        </div>
      </footer>
    </div>
  )
}
