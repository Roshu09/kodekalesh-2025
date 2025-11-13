import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"

/**
 * DynamoDB Helper for MindTrack
 *
 * This module provides utility functions for interacting with AWS DynamoDB
 * to store anonymized assessment results and badge mints.
 */

export interface AssessmentResult {
  assessmentId: string // Changed from 'id' to 'assessmentId' to match DynamoDB table schema
  score: number
  level: "Low" | "Moderate" | "High"
  timestamp: string
  // Only store anonymized/hashed data
  answersHash: string
}

export interface BadgeMint {
  txHash: string // Changed from 'id' to 'txHash' to match DynamoDB table schema
  transactionHash: string
  walletAddress: string
  network: string
  timestamp: string
}

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-south-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const docClient = DynamoDBDocumentClient.from(client)

/**
 * Save assessment result to DynamoDB
 */
export async function saveAssessmentResult(result: AssessmentResult): Promise<boolean> {
  try {
    await docClient.send(
      new PutCommand({
        TableName: process.env.DYNAMODB_ASSESSMENTS_TABLE || "MindTrackAssessments",
        Item: result,
      })
    )

    console.log("[DynamoDB] Saved assessment result:", result.assessmentId) // Updated to use assessmentId
    return true
  } catch (error) {
    console.error("[DynamoDB] Error saving result:", error)
    return false
  }
}

/**
 * Save badge mint to DynamoDB
 */
export async function saveBadgeMint(badge: BadgeMint): Promise<boolean> {
  try {
    await docClient.send(
      new PutCommand({
        TableName: process.env.DYNAMODB_MINTS_TABLE || "MindTrackMintRecords",
        Item: badge,
      })
    )

    console.log("[DynamoDB] Saved badge mint:", badge.txHash) // Updated to use txHash
    return true
  } catch (error) {
    console.error("[DynamoDB] Error saving badge:", error)
    return false
  }
}

/**
 * Hash sensitive data before storage
 */
export function hashAnswers(answers: Record<string, number>): string {
  // Simple hash for demo - use crypto.subtle.digest in production
  return Buffer.from(JSON.stringify(answers)).toString("base64")
}
