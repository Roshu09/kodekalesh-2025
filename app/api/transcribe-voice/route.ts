import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("[API] Received voice transcription request")

    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 })
    }

    console.log("[API] Audio file received:", audioFile.name, audioFile.size, "bytes")

    // In production, this would:
    // 1. Upload audio to S3
    // 2. Trigger AWS Transcribe job
    // 3. Wait for transcription result
    // 4. Run sentiment analysis with Amazon Comprehend
    // 5. Save results to DynamoDB

    // For demo/testing, we'll simulate the AWS response
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock transcription result (in production, this comes from AWS Transcribe + Comprehend)
    const mockResult = {
      transcript:
        "I've been feeling a bit stressed lately with work deadlines. Sleep hasn't been great, but I'm trying to stay positive and exercise more. Some days are harder than others, but I'm managing okay overall.",
      sentiment: "MIXED" as const,
      emotions: [
        { name: "stress", score: 0.65 },
        { name: "hope", score: 0.45 },
        { name: "anxiety", score: 0.35 },
      ],
      keyPhrases: ["work deadlines", "sleep quality", "staying positive", "exercise routine"],
      recommendations: [
        "Consider stress management techniques like deep breathing or meditation",
        "Maintain a consistent sleep schedule (7-9 hours per night)",
        "Continue with regular physical exercise - it helps reduce stress",
        "If stress persists, consider speaking with a counselor",
      ],
      riskLevel: "Moderate" as const,
    }

    console.log("[API] Transcription complete (mock)")

    return NextResponse.json(mockResult)
  } catch (error) {
    console.error("[API] Transcription error:", error)
    return NextResponse.json(
      { error: "Failed to process audio transcription" },
      { status: 500 }
    )
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
