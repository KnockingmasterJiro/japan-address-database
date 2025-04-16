"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle2, Upload } from 'lucide-react'
import { useRouter } from "next/navigation"

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [parseProgress, setParseProgress] = useState(0)
  const [result, setResult] = useState<{ success: boolean; message: string; count?: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      // ファイルが選択されたらリセット
      setResult(null)
      setUploadProgress(0)
      setParseProgress(0)
    }
  }

  const handleImport = async () => {
    if (!file) return

    setLoading(true)
    setResult(null)
    setUploadProgress(0)
    setParseProgress(0)

    try {
      // FormDataを作成してファイルを追加
      const formData = new FormData()
      formData.append("csvFile", file)

      // 進捗状況を追跡するためのカスタムフェッチ
      const xhr = new XMLHttpRequest()
      xhr.open("POST", "/api/import", true)

      // 進捗状況のイベントリスナー
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100)
          setUploadProgress(percentComplete)
        }
      }

      // レスポンス処理
      xhr.onload = async () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)

          // CSVのパース完了
          setParseProgress(100)

          // 処理開始のメッセージを表示
          setResult({
            success: true,
            message: `${response.count.toLocaleString()}件のデータを処理中です。処理状況ページで進捗を確認できます。`,
            count: response.count,
          })

          // 処理状態ページに遷移
          setTimeout(() => {
            router.push("/import/status")
          }, 2000)
        } else {
          setResult({
            success: false,
            message: "データのインポートに失敗しました。サーバーエラーが発生しました。",
          })
          setLoading(false)
        }
      }

      // エラー処理
      xhr.onerror = () => {
        setResult({
          success: false,
          message: "ネットワークエラーが発生しました。接続を確認してください。",
        })
        setLoading(false)
      }

      // リクエスト送信
      xhr.send(formData)

      // CSVパース進捗のシミュレーション
      // 実際のアプリケーションでは、サーバーからの進捗状況を取得
      const parseInterval = setInterval(() => {
        setParseProgress((prev) => {
          if (prev >= 90) {
            clearInterval(parseInterval)
            return prev
          }
          return prev + 10
        })
      }, 500)
    } catch (error) {
      setResult({
        success: false,
        message: "データのインポートに失敗しました。ファイル形式を確認してください。",
      })
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFile(null)
    setResult(null)
    setUploadProgress(0)
    setParseProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Geolonia住所データのインポート</CardTitle>
        <CardDescription>
          Geolonia住所データ（CSV形式）をインポートして、データベースを構築します。
          大量のデータ（約27万件）を処理するため、インポート処理には時間がかかる場合があります。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="csv-file">CSVファイル</Label>
            <Input id="csv-file" ref={fileInputRef} type="file" accept=".csv" onChange={handleFileChange} />
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Geolonia住所データのCSVファイル（latest.csv）を選択してください。</p>
            <p className="mt-2">
              データソース:{" "}
              <a
                href="https://geolonia.github.io/japanese-addresses/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Geolonia住所データ
              </a>
            </p>
            <p className="mt-1">
              ダウンロードリンク:{" "}
              <a
                href="https://github.com/geolonia/japanese-addresses/raw/master/latest.csv"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                latest.csv
              </a>
            </p>
          </div>

          {loading && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">ファイルアップロード</span>
                  <span className="text-sm font-medium">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2 mt-1" />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">CSVパース処理</span>
                  <span className="text-sm font-medium">{parseProgress}%</span>
                </div>
                <Progress value={parseProgress} className="h-2 mt-1" />
              </div>

              <p className="text-xs text-muted-foreground">
                大きなファイルの処理には時間がかかります。ブラウザを閉じないでください。
              </p>
            </div>
          )}

          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              {result.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertTitle>{result.success ? "成功" : "エラー"}</AlertTitle>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={resetForm}>
          リセット
        </Button>
        <Button onClick={handleImport} disabled={!file || loading} className="flex items-center gap-2">
          {loading ? (
            "インポート中..."
          ) : (
            <>
              <Upload className="h-4 w-4" />
              インポート開始
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}