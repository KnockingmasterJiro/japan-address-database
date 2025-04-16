import { NextResponse } from "next/server"
import { batchProcessAddresses } from "@/lib/db"
import type { AddressData } from "@/lib/address-data"

// 処理状態を保持するグローバル変数（実際のアプリケーションではRedisなどを使用）
let processingStatus = {
  isProcessing: false,
  totalRecords: 0,
  processedRecords: 0,
  startTime: 0,
  endTime: 0,
  error: null as string | null,
}

export async function POST(request: Request) {
  try {
    // すでに処理中の場合はエラーを返す
    if (processingStatus.isProcessing) {
      return NextResponse.json({ error: "別のインポート処理が進行中です" }, { status: 409 })
    }

    // 処理状態をリセット
    processingStatus = {
      isProcessing: true,
      totalRecords: 0,
      processedRecords: 0,
      startTime: Date.now(),
      endTime: 0,
      error: null,
    }

    // リクエストからJSONを取得
    const { records } = await request.json()

    if (!records || !Array.isArray(records)) {
      processingStatus.isProcessing = false
      processingStatus.error = "有効なデータが見つかりません"
      return NextResponse.json({ error: processingStatus.error }, { status: 400 })
    }

    // 総レコード数を設定
    processingStatus.totalRecords = records.length

    // 非同期でデータ処理を開始（レスポンスを待たずに処理を続行）
    processAddressData(records).catch((error) => {
      console.error("データ処理中にエラーが発生しました:", error)
      processingStatus.error = String(error)
      processingStatus.isProcessing = false
      processingStatus.endTime = Date.now()
    })

    // 処理開始のレスポンスを返す
    return NextResponse.json({
      success: true,
      message: `${records.length.toLocaleString()}件のデータの処理を開始しました`,
      status: processingStatus,
    })
  } catch (error) {
    processingStatus.isProcessing = false
    processingStatus.error = String(error)
    processingStatus.endTime = Date.now()

    console.error("Error processing data:", error)
    return NextResponse.json({ error: "データの処理に失敗しました", details: String(error) }, { status: 500 })
  }
}

export async function GET() {
  // 現在の処理状態を返す
  return NextResponse.json({
    status: processingStatus,
  })
}

// 住所データを非同期で処理する関数
async function processAddressData(records: any[]) {
  try {
    // AddressData型に変換
    const addressData: AddressData[] = records.map((record) => ({
      pref_code: record.pref_code,
      pref: record.pref,
      city_code: record.city_code,
      city: record.city,
      town_code: record.town_id,
      town: record.town,
      koaza: record.koaza || "",
      lat: Number.parseFloat(record.lat),
      lng: Number.parseFloat(record.lng),
    }))

    // バッチ処理で住所データを保存
    const savedCount = await batchProcessAddresses(
      addressData,
      1000, // バッチサイズ
      (processed, total) => {
        // 進捗状況を更新
        processingStatus.processedRecords = processed
      },
    )

    // 処理完了
    processingStatus.processedRecords = savedCount
    processingStatus.isProcessing = false
    processingStatus.endTime = Date.now()
  } catch (error) {
    // エラー処理
    processingStatus.error = String(error)
    processingStatus.isProcessing = false
    processingStatus.endTime = Date.now()
    throw error
  }
}