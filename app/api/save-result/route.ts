import { NextResponse } from "next/server"
import { saveAssessmentResult, hashAnswers } from "@/lib/aws-dynamodb"
import { randomUUID } from "crypto"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { answers, score, level } = body

    console.log("[API] Saving assessment result to DynamoDB...")

    const result = {
      assessmentId: randomUUID(),
      score,
      level,
      timestamp: new Date().toISOString(),
      answersHash: hashAnswers(answers),
    }

    const success = await saveAssessmentResult(result)

    if (!success) {
      throw new Error("Failed to save to DynamoDB")
    }

    return NextResponse.json({
      success: true,
      message: "Result saved successfully to AWS DynamoDB",
      id: result.assessmentId,
    })
  } catch (error) {
    console.error("[API] Error saving result:", error)
    return NextResponse.json(
      { success: false, error: "Failed to save result" },
      { status: 500 }
    )
  }
}
