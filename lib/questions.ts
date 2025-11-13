export const questions = [
  {
    id: "sleep",
    question: "How would you rate your sleep quality over the past two weeks?",
    options: [
      { value: "0", label: "Sleeping well (7-9 hours, feel rested)" },
      { value: "1", label: "Slightly disturbed (occasional difficulty falling/staying asleep)" },
      { value: "2", label: "Moderately disturbed (frequent difficulty, some fatigue)" },
      { value: "3", label: "Severely disturbed (chronic insomnia, constant exhaustion)" },
    ],
    category: "Sleep Pattern",
  },
  {
    id: "mood",
    question: "How often have you felt down, sad, or hopeless recently?",
    options: [
      { value: "0", label: "Not at all / Rarely" },
      { value: "1", label: "Several days" },
      { value: "2", label: "More than half the days" },
      { value: "3", label: "Nearly every day" },
    ],
    category: "Mood Stability",
  },
  {
    id: "appetite",
    question: "Have you noticed changes in your appetite or eating habits?",
    options: [
      { value: "0", label: "No change / Normal appetite" },
      { value: "1", label: "Slight changes (eating a bit more or less)" },
      { value: "2", label: "Moderate changes (noticeable increase or decrease)" },
      { value: "3", label: "Significant changes (much more or much less, weight change)" },
    ],
    category: "Appetite & Eating",
  },
  {
    id: "focus",
    question: "How has your ability to concentrate and focus been?",
    options: [
      { value: "0", label: "Normal / No issues" },
      { value: "1", label: "Occasionally distracted" },
      { value: "2", label: "Frequently have trouble focusing" },
      { value: "3", label: "Cannot concentrate on anything" },
    ],
    category: "Cognitive Function",
  },
  {
    id: "social",
    question: "How would you describe your social interactions and connections?",
    options: [
      { value: "0", label: "Active and connected (regular contact with friends/family)" },
      { value: "1", label: "Somewhat reduced (less social than usual)" },
      { value: "2", label: "Significantly withdrawn (avoiding most interactions)" },
      { value: "3", label: "Completely isolated (no meaningful social contact)" },
    ],
    category: "Social Engagement",
  },
]

export function calculateRiskScore(answers: Record<string, string>): {
  totalScore: number
  maxScore: number
  riskLevel: "Low" | "Moderate" | "High"
  percentageScore: number
  categoryScores: Array<{ category: string; score: number; maxScore: number; percentage: number }>
} {
  const totalScore = Object.values(answers).reduce((sum, val) => sum + Number.parseInt(val), 0)
  const maxScore = questions.length * 3 // Each question max is 3
  const percentageScore = Math.round((totalScore / maxScore) * 100)

  // Calculate category scores
  const categoryScores = questions.map((q) => {
    const score = Number.parseInt(answers[q.id] || "0")
    const maxScore = 3
    const percentage = Math.round(((maxScore - score) / maxScore) * 100)
    return {
      category: q.category,
      score,
      maxScore,
      percentage,
    }
  })

  let riskLevel: "Low" | "Moderate" | "High"

  if (percentageScore <= 30) {
    riskLevel = "Low"
  } else if (percentageScore <= 60) {
    riskLevel = "Moderate"
  } else {
    riskLevel = "High"
  }

  return {
    totalScore,
    maxScore,
    riskLevel,
    percentageScore,
    categoryScores,
  }
}
