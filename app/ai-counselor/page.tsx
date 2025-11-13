"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Brain, ArrowLeft, Send, Bot, User, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function AICounselorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI Mental Health Companion. I'm here to listen and provide support. How are you feeling today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    // Keyword-based responses for demonstration
    if (lowerMessage.includes("anxious") || lowerMessage.includes("anxiety") || lowerMessage.includes("worried")) {
      return "I understand that feeling anxious can be overwhelming. Try taking slow, deep breaths - inhale for 4 counts, hold for 4, exhale for 4. Remember, anxiety is temporary and you have the strength to work through this. Would you like to talk about what's making you feel anxious?"
    }

    if (lowerMessage.includes("stress") || lowerMessage.includes("overwhelm")) {
      return "Stress is a natural response, but it's important to manage it. Consider breaking your tasks into smaller, manageable steps. Take regular breaks, practice mindfulness, and don't hesitate to ask for help when needed. What's currently causing you the most stress?"
    }

    if (lowerMessage.includes("sad") || lowerMessage.includes("depressed") || lowerMessage.includes("down")) {
      return "I'm sorry you're feeling this way. Your feelings are valid, and it's okay to not be okay sometimes. Small steps like getting some sunlight, gentle exercise, or talking to someone you trust can help. If these feelings persist, please consider reaching out to a mental health professional. I'm here to listen."
    }

    if (lowerMessage.includes("sleep") || lowerMessage.includes("insomnia") || lowerMessage.includes("tired")) {
      return "Sleep issues can really impact your wellbeing. Try establishing a consistent bedtime routine, avoid screens 1 hour before bed, keep your bedroom cool and dark, and limit caffeine after 2pm. If sleep problems persist for more than 2 weeks, consider consulting a healthcare provider."
    }

    if (lowerMessage.includes("lonely") || lowerMessage.includes("alone") || lowerMessage.includes("isolated")) {
      return "Feeling lonely is more common than you might think. Try reaching out to old friends, joining online communities with shared interests, or volunteering. Even small social interactions can make a difference. Remember, you're not alone in feeling alone, and this feeling is temporary."
    }

    if (lowerMessage.includes("thank") || lowerMessage.includes("help")) {
      return "You're very welcome! I'm glad I could help. Remember, taking care of your mental health is an ongoing journey, and it's okay to seek support. Is there anything else you'd like to talk about?"
    }

    // Default empathetic response
    const defaultResponses = [
      "I hear you. Can you tell me more about what you're experiencing?",
      "Thank you for sharing that with me. How long have you been feeling this way?",
      "That sounds challenging. What do you think would help you feel better right now?",
      "I appreciate you opening up. Remember, it's okay to have these feelings. What support do you have around you?",
      "Your feelings are valid. Have you noticed any patterns or triggers for how you're feeling?",
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(
      () => {
        const response = generateResponse(input)
        const assistantMessage: Message = {
          role: "assistant",
          content: response,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, assistantMessage])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

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
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Chat Interface */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">AI Mental Health Companion</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  <div className="w-2 h-2 rounded-full bg-success mr-1.5 animate-pulse" />
                  Online
                </Badge>
                <span className="text-sm text-muted-foreground">Powered by Advanced AI</span>
              </div>
            </div>
          </div>
        </div>

        <Card className="border-border/50 h-[600px] flex flex-col">
          <CardHeader className="border-b border-border/50">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <CardTitle className="text-lg">24/7 Confidential Support</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  This AI counselor provides immediate support and coping strategies. For emergencies or persistent
                  issues, please contact a licensed professional.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, i) => (
              <div key={i} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-accent" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input */}
          <div className="border-t border-border/50 p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button onClick={handleSend} disabled={!input.trim() || isTyping}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              This is a support tool, not a replacement for professional care. In crisis, call 988 (US) or your local
              emergency number.
            </p>
          </div>
        </Card>

        {/* Quick Tips */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="text-2xl mb-2">🧘</div>
              <h3 className="font-semibold mb-1">Try Breathing</h3>
              <p className="text-sm text-muted-foreground">4-7-8 technique: Inhale 4s, hold 7s, exhale 8s</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="text-2xl mb-2">🚶</div>
              <h3 className="font-semibold mb-1">Take a Walk</h3>
              <p className="text-sm text-muted-foreground">10 minutes outside can boost your mood</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="text-2xl mb-2">💬</div>
              <h3 className="font-semibold mb-1">Connect</h3>
              <p className="text-sm text-muted-foreground">Reach out to a friend or family member</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
