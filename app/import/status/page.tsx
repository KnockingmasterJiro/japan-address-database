"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react'
import { useRouter } from "next/navigation"

interface ProcessingStatus {
  isProcessing: boolean
  totalRecords: number
  processedRecords: number
  startTime: number
  endTime: number
  error: string | null
}

export default function ImportStatusPage() {
  const [status, setStatus] = useState<ProcessingStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // 処理状態を取得する関数
  const fetchStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/import/process")

      if (!response.ok) {
        throw new Error("ステータスの取得に失敗しました")
      }

      const data = await response.json()
      setStatus(data.status)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "不明なエラーが発生しました")
    } finally {
      setLoading(false)
    }
  }

  // 初回読み込み時にステータスを取得
  useEffect(() => {
    fetchStatus()

    // 処理中の場合は定期的に更新
    const interval = setInterval(() => {
      if (status?.isProcessing) {
        fetchStatus()
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [status?.isProcessing])

  // 進捗率を計算
  const progressPercentage = status ? Math.round((status.processedRecords / Math.max(status.totalRecords, 1)) * 100) : 0

  // 経過時間を計算
  const getElapsedTime = () => {
    if (!status) return "0秒"

    const endTime = status.endTime || Date.now()
    const elapsedMs = endTime - status.startTime

    if (elapsedMs < 1000) return `${elapsedMs}ミリ秒`
    if (elapsedMs < 60000) return `${Math.round(elapsedMs / 1000)}秒`

    const minutes = Math.floor(elapsedMs / 60000)
    const seconds = Math.round((elapsedMs % 60000) / 1000)
    return `${minutes}分${seconds}秒`
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>インポート処理状況</CardTitle>
          <Button variant="outline" size="icon" onClick={fetchStatus} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>エラー</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : status ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">処理状況</span>
                <span className="text-sm font-medium">
                  {status.isProcessing ? "処理中" : status.error ? "エラー" : "完了"}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {status.processedRecords.toLocaleString()} / {status.totalRecords.toLocaleString()}件
                </span>
                <span>{progressPercentage}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">開始時間</p>
                <p>{status.startTime ? new Date(status.startTime).toLocaleString() : "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">経過時間</p>
                <p>{getElapsedTime()}</p>
              </div>
            </div>

            {status.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>処理エラー</AlertTitle>
                <AlertDescription>{status.error}</AlertDescription>
              </Alert>
            )}

            {!status.isProcessing && !status.error && status.endTime > 0 && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>処理完了</AlertTitle>
                <AlertDescription>
                  {status.totalRecords.toLocaleString()}件のデータが正常に処理されました。
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => router.push("/import")}>
                インポートページに戻る
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <p>読み込み中...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}