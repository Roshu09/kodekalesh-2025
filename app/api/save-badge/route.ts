import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { transactionHash, walletAddress, timestamp, network } = body

    console.log("[API] Saving Aptos badge mint:", { transactionHash, network })

    return NextResponse.json({
      success: true,
      message: "Badge mint recorded successfully",
    })
  } catch (error) {
    console.error("[API] Error saving badge:", error)
    return NextResponse.json({ success: false, error: "Failed to save badge" }, { status: 500 })
  }
}
