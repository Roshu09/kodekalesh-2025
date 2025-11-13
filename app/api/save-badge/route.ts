import { NextResponse } from "next/server"
import { saveBadgeMint } from "@/lib/aws-dynamodb"
import { randomUUID } from "crypto"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { transactionHash, walletAddress, network } = body

    console.log("[API] Saving Aptos badge mint to DynamoDB...")

    const badge = {
      txHash: transactionHash,
      transactionHash,
      walletAddress,
      network,
      timestamp: new Date().toISOString(),
    }

    const success = await saveBadgeMint(badge)

    if (!success) {
      throw new Error("Failed to save to DynamoDB")
    }

    return NextResponse.json({
      success: true,
      message: "Badge mint recorded successfully in AWS DynamoDB",
    })
  } catch (error) {
    console.error("[API] Error saving badge:", error)
    return NextResponse.json(
      { success: false, error: "Failed to save badge" },
      { status: 500 }
    )
  }
}
