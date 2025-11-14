"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Square, Upload, Loader2, Volume2, Sparkles, TrendingUp } from 'lucide-react'
import { Navbar } from "@/components/navbar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface TranscriptionResult {
  transcript: string
  sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE" | "MIXED"
  emotions: {
    name: string
    score: number
  }[]
  keyPhrases: string[]
  recommendations: string[]
  riskLevel: "Low" | "Moderate" | "High"
}

export default function VoiceJournalPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcription, setTranscription] = useState<TranscriptionResult | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        setAudioBlob(audioBlob)
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("[v0] Microphone access error:", error)
      alert("Unable to access microphone. Please grant microphone permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const handleUpload = async () => {
    if (!audioBlob) return

    setIsProcessing(true)
    console.log("[v0] Uploading audio for transcription...")

    try {
      const formData = new FormData()
      formData.append("audio", audioBlob, "voice-journal.webm")

      const response = await fetch("/api/transcribe-voice", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Transcription failed")
      }

      const result = await response.json()
      setTranscription(result)
      console.log("[v0] Transcription complete:", result)
    } catch (error) {
      console.error("[v0] Transcription error:", error)
      alert("Unable to process audio. Please try again or check AWS configuration.")
    } finally {
      setIsProcessing(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "POSITIVE":
        return "bg-success/10 text-success border-success/20"
      case "NEGATIVE":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "MIXED":
        return "bg-warning/10 text-warning border-warning/20"
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20"
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Low":
        return "bg-success/10 text-success border-success/20"
      case "Moderate":
        return "bg-warning/10 text-warning border-warning/20"
      case "High":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Voice Journal</h1>
          <p className="text-muted-foreground">
            Record your thoughts and feelings. AI will analyze your voice for mental health insights.
          </p>
        </div>

        <Card className="mb-6 border-warning/50 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="text-2xl">ℹ️</div>
              <div>
                <h3 className="font-semibold text-warning mb-1">How Voice Analysis Works</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your voice recording is transcribed using AWS Transcribe, then analyzed for sentiment and emotional
                  indicators. Speak naturally for 30-60 seconds about how you're feeling today.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recording Section */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Record Your Voice</CardTitle>
              <CardDescription>Speak for 30-60 seconds about your current wellbeing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Recording Interface */}
              <div className="flex flex-col items-center justify-center py-8 space-y-6">
                {isRecording ? (
                  <>
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-destructive/20 flex items-center justify-center animate-pulse">
                        <Mic className="w-16 h-16 text-destructive" />
                      </div>
                      <div className="absolute inset-0 rounded-full border-4 border-destructive/30 animate-ping" />
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold font-mono">{formatTime(recordingTime)}</p>
                      <p className="text-sm text-muted-foreground mt-1">Recording in progress...</p>
                    </div>
                    <Button size="lg" variant="destructive" onClick={stopRecording}>
                      <Square className="w-5 h-5 mr-2" />
                      Stop Recording
                    </Button>
                  </>
                ) : audioBlob ? (
                  <>
                    <div className="w-32 h-32 rounded-full bg-success/20 flex items-center justify-center">
                      <Volume2 className="w-16 h-16 text-success" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold">Recording Complete</p>
                      <p className="text-sm text-muted-foreground mt-1">Duration: {formatTime(recordingTime)}</p>
                    </div>
                    <audio controls src={audioUrl || undefined} className="w-full" />
                    <div className="flex gap-3 w-full">
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={() => {
                          setAudioBlob(null)
                          setAudioUrl(null)
                          setTranscription(null)
                        }}
                        className="flex-1"
                      >
                        Record Again
                      </Button>
                      <Button
                        size="lg"
                        onClick={handleUpload}
                        disabled={isProcessing}
                        className="flex-1 bg-primary shadow-lg"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 mr-2" />
                            Analyze Recording
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center">
                      <Mic className="w-16 h-16 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold mb-2">Ready to Record</p>
                      <p className="text-sm text-muted-foreground">
                        Click the button below to start recording your voice journal
                      </p>
                    </div>
                    <Button size="lg" onClick={startRecording} className="shadow-lg">
                      <Mic className="w-5 h-5 mr-2" />
                      Start Recording
                    </Button>
                  </>
                )}
              </div>

              {/* AWS Tech Stack Info */}
              <Card className="bg-muted/30 border-muted">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Powered by AWS</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• AWS Transcribe - Speech-to-text conversion</li>
                        <li>• Amazon Comprehend - Sentiment analysis</li>
                        <li>• AWS Lambda - Serverless processing</li>
                        <li>• DynamoDB - Secure storage</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>AI Analysis Results</CardTitle>
              <CardDescription>Mental health insights from your voice journal</CardDescription>
            </CardHeader>
            <CardContent>
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                  <Loader2 className="w-12 h-12 animate-spin text-primary" />
                  <p className="text-muted-foreground">Analyzing your recording...</p>
                </div>
              ) : transcription ? (
                <div className="space-y-6">
                  {/* Transcript */}
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Transcript</h4>
                    <Card className="bg-muted/30 border-muted">
                      <CardContent className="pt-4">
                        <p className="text-sm leading-relaxed">{transcription.transcript}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sentiment & Risk */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Sentiment</h4>
                      <Badge className={getSentimentColor(transcription.sentiment)} variant="outline">
                        {transcription.sentiment}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Risk Level</h4>
                      <Badge className={getRiskColor(transcription.riskLevel)} variant="outline">
                        {transcription.riskLevel}
                      </Badge>
                    </div>
                  </div>

                  {/* Emotions Detected */}
                  <div>
                    <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Emotions Detected
                    </h4>
                    <div className="space-y-3">
                      {transcription.emotions.map((emotion, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium capitalize">{emotion.name}</span>
                            <span className="text-muted-foreground">{Math.round(emotion.score * 100)}%</span>
                          </div>
                          <Progress value={emotion.score * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Phrases */}
                  {transcription.keyPhrases.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Key Phrases</h4>
                      <div className="flex flex-wrap gap-2">
                        {transcription.keyPhrases.map((phrase, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {phrase}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-semibold mb-3 text-sm">Recommendations</h4>
                    <ul className="space-y-2">
                      {transcription.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-primary mt-0.5">•</span>
                          <span className="leading-relaxed">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Record and analyze your voice to see insights here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
