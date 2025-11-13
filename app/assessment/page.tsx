"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Navbar } from "@/components/navbar"

const questions = [
  {
    id: "sleep",
    question: "How would you rate your sleep quality recently?",
    options: [
      { value: "0", label: "Good - Sleeping well, feeling rested" },
      { value: "1", label: "Fair - Some difficulty, but manageable" },
      { value: "2", label: "Poor - Significant sleep issues" },
    ],
  },
  {
    id: "mood",
    question: "How has your overall mood been?",
    options: [
      { value: "0", label: "Positive - Generally happy and content" },
      { value: "1", label: "Neutral - Some ups and downs" },
      { value: "2", label: "Low - Feeling sad or down frequently" },
    ],
  },
  {
    id: "appetite",
    question: "How has your appetite been?",
    options: [
      { value: "0", label: "Normal - Eating regularly and well" },
      { value: "1", label: "Changed - Some increase or decrease" },
      { value: "2", label: "Significant change - Major loss or increase" },
    ],
  },
  {
    id: "focus",
    question: "How is your ability to concentrate?",
    options: [
      { value: "0", label: "Good - Able to focus on tasks" },
      { value: "1", label: "Moderate - Some difficulty concentrating" },
      { value: "2", label: "Poor - Hard to focus on anything" },
    ],
  },
  {
    id: "social",
    question: "How has your social interaction been?",
    options: [
      { value: "0", label: "Active - Engaging with others regularly" },
      { value: "1", label: "Reduced - Less social than usual" },
      { value: "2", label: "Withdrawn - Avoiding social contact" },
    ],
  },
]

export default function AssessmentPage() {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    let score = 0
    Object.values(answers).forEach((value) => {
      score += Number.parseInt(value as string)
    })

    try {
      const response = await fetch("/api/save-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          score,
          timestamp: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        console.log("[v0] Assessment saved to DynamoDB")
      }
    } catch (error) {
      console.log("[v0] AWS backend not configured yet")
    }

    // Store answers in localStorage
    localStorage.setItem("assessmentAnswers", JSON.stringify(answers))
    router.push("/results")
  }

  const currentQ = questions[currentQuestion]
  const isAnswered = !!answers[currentQ.id]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <Navbar />

      {/* Assessment Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-balance">Mental Wellbeing Assessment</h1>
            <p className="text-muted-foreground">Answer these 5 questions to help us understand your current state</p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-primary font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-balance leading-relaxed">{currentQ.question}</CardTitle>
              <CardDescription>Select the option that best describes your current state</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[currentQ.id] || ""}
                onValueChange={(value) => handleAnswer(currentQ.id, value)}
                className="space-y-3"
              >
                {currentQ.options.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-start space-x-3 p-4 rounded-lg border transition-all cursor-pointer hover:border-primary/50 ${
                      answers[currentQ.id] === option.value ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <RadioGroupItem value={option.value} id={`${currentQ.id}-${option.value}`} className="mt-0.5" />
                    <Label htmlFor={`${currentQ.id}-${option.value}`} className="flex-1 cursor-pointer leading-relaxed">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button variant="outline" onClick={handleBack} disabled={currentQuestion === 0}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            {currentQuestion < questions.length - 1 ? (
              <Button onClick={handleNext} disabled={!isAnswered}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!isAnswered}>
                Complete Assessment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
