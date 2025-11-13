"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send, Bot, User, Sparkles } from "lucide-react"
import { Navbar } from "@/components/navbar"

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
        "Hello! I'm your MindTrack AI Mental Health Companion. I'm here to provide support and guidance. How are you feeling today? Remember, I'm not a replacement for professional help, but I'm here to listen and offer coping strategies.",
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

  const getAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI response with contextual replies
    const lowerMessage = userMessage.toLowerCase()

    // Crisis detection
    if (
      lowerMessage.includes("suicide") ||
      lowerMessage.includes("kill myself") ||
      lowerMessage.includes("end my life")
    ) {
      return "I'm very concerned about what you're sharing. Please reach out to a crisis helpline immediately:\n\n🆘 US: 988 (Suicide & Crisis Lifeline)\n🆘 International: findahelpline.com\n\nYou deserve support right now. These trained professionals are available 24/7 and want to help. Please call them - your life matters."
    }

    // Anxiety responses
    if (lowerMessage.includes("anxious") || lowerMessage.includes("anxiety") || lowerMessage.includes("worried")) {
      return "I understand you're feeling anxious. Here are some immediate techniques that might help:\n\n1. **4-7-8 Breathing**: Breathe in for 4 counts, hold for 7, exhale for 8. Repeat 4 times.\n2. **Grounding Exercise**: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.\n3. **Progressive Muscle Relaxation**: Tense and release each muscle group starting from your toes.\n\nWould you like to talk more about what's causing your anxiety?"
    }

    // Depression responses
    if (lowerMessage.includes("depressed") || lowerMessage.includes("depression") || lowerMessage.includes("sad")) {
      return "I hear that you're going through a difficult time. Depression can feel overwhelming, but you're taking a positive step by reaching out. Some suggestions:\n\n✓ Start small - even tiny accomplishments matter\n✓ Try to maintain a routine with sleep and meals\n✓ Connect with someone you trust\n✓ Consider speaking with a mental health professional\n✓ Move your body, even just a short walk\n\nWhat specific challenges are you facing right now?"
    }

    // Stress responses
    if (lowerMessage.includes("stress") || lowerMessage.includes("overwhelmed") || lowerMessage.includes("pressure")) {
      return "Feeling stressed or overwhelmed is challenging. Let's work on breaking things down:\n\n📋 **Immediate stress relief**:\n- Take 5 deep breaths right now\n- Write down what's stressing you\n- Identify one thing you can control today\n\n💪 **Longer-term strategies**:\n- Prioritize tasks (urgent vs important)\n- Set boundaries and learn to say no\n- Schedule breaks and self-care\n\nWhat's the main source of your stress?"
    }

    // Sleep issues
    if (lowerMessage.includes("sleep") || lowerMessage.includes("insomnia") || lowerMessage.includes("tired")) {
      return "Sleep difficulties can really impact your wellbeing. Here are evidence-based sleep hygiene tips:\n\n🌙 **Before bed**:\n- Set a consistent sleep schedule\n- Avoid screens 1 hour before bed\n- Keep your room cool and dark\n- Try relaxation exercises\n\n☕ **During the day**:\n- Limit caffeine after 2 PM\n- Get natural sunlight exposure\n- Exercise, but not close to bedtime\n\nHow long have you been experiencing sleep issues?"
    }

    // Positive check-ins
    if (
      lowerMessage.includes("good") ||
      lowerMessage.includes("better") ||
      lowerMessage.includes("great") ||
      lowerMessage.includes("fine")
    ) {
      return "That's wonderful to hear! 🌟 It's important to recognize and celebrate when we're feeling good. What do you think has been contributing to your positive mood? Identifying these factors can help you maintain your wellbeing."
    }

    // Default empathetic response
    const responses = [
      "I appreciate you sharing that with me. Can you tell me more about what you're experiencing? I'm here to listen and support you.",
      "Thank you for opening up. Your feelings are valid. What would be most helpful for you right now - coping strategies, someone to listen, or information about professional resources?",
      "I hear you. It takes courage to talk about these things. Would you like to explore some coping techniques, or would you prefer to discuss what's on your mind further?",
      "That sounds challenging. Remember, seeking support is a sign of strength. How can I best support you right now? Would practical tips or a listening ear be more helpful?",
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
      async () => {
        const aiResponse = await getAIResponse(input)

        const assistantMessage: Message = {
          role: "assistant",
          content: aiResponse,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, assistantMessage])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">AI Mental Health Companion</h1>
              <p className="text-muted-foreground text-sm">24/7 support and guidance</p>
            </div>
          </div>
        </div>

        <Card className="mb-4 border-warning/50 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="text-xl">⚠️</div>
              <div className="text-sm space-y-1">
                <p className="font-medium text-warning">Important Disclaimer</p>
                <p className="text-muted-foreground leading-relaxed">
                  This AI companion provides general support and coping strategies but is not a substitute for
                  professional mental healthcare. If you're in crisis, please contact emergency services or call 988
                  (US) immediately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 h-[600px] flex flex-col">
          <CardHeader className="border-b border-border/50 flex-shrink-0">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 text-primary" />
              Chat Session
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, idx) => (
              <div key={idx} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground border border-border/50"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                  <p
                    className={`text-xs mt-2 ${message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-accent" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="bg-muted border border-border/50 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          <div className="border-t border-border/50 p-4 flex-shrink-0">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button type="submit" disabled={!input.trim() || isTyping} size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>

        <Card className="mt-4 border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Quick Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-1">
                <p className="font-medium">Crisis Support</p>
                <p className="text-muted-foreground">988 - Suicide & Crisis Lifeline</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium">Text Support</p>
                <p className="text-muted-foreground">Text "HELLO" to 741741</p>
              </div>
              <div className="space-y-1">
                <p className="font-medium">International</p>
                <p className="text-muted-foreground">findahelpline.com</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
