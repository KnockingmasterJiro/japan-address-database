import { NextResponse } from "next/server"
import { parse } from "csv-parse"
import { Readable } from "stream"

// CSVデータの型定義
interface GeoloniaAddressRecord {
  pref: string
  city: string
  town: string
  koaza: string
  lat: string
  lng: string
  pref_code: string
  city_code: string
  town_id: string
}

export async function POST(request: Request) {
  try {
    // リクエストからFormDataを取得
    const formData = await request.formData()
    const csvFile = formData.get("csvFile") as File

    if (!csvFile) {
      return NextResponse.json({ error: "CSVファイルが見つかりません" }, { status: 400 })
    }

    // ファイルタイプの検証
    if (csvFile.type !== "text/csv" && !csvFile.name.endsWith(".csv")) {
      return NextResponse.json({ error: "CSVファイル形式が正しくありません" }, { status: 400 })
    }

    // ファイルをバッファに変換
    const buffer = await csvFile.arrayBuffer()
    const fileContent = new Uint8Array(buffer)

    // CSVパース処理
    const records = await parseCSV(fileContent)

    // 処理開始のレスポンスを返す
    return NextResponse.json({
      success: true,
      message: "データのインポートが開始されました",
      count: records.length,
      records: records.slice(0, 10), // 最初の10件だけ返す（デバッグ用）
    })
  } catch (error) {
    console.error("Error importing data:", error)
    return NextResponse.json({ error: "データのインポートに失敗しました", details: String(error) }, { status: 500 })
  }
}

// CSVパース関数
async function parseCSV(fileContent: Uint8Array): Promise<GeoloniaAddressRecord[]> {
  return new Promise((resolve, reject) => {
    const records: GeoloniaAddressRecord[] = []

    // Uint8ArrayをReadableStreamに変換
    const stream = Readable.from(Buffer.from(fileContent))

    // CSVパーサーの設定
    const parser = parse({
      columns: true, // 1行目をヘッダーとして使用
      skip_empty_lines: true, // 空行をスキップ
      trim: true, // 値の前後の空白を削除
      bom: true, // BOMを処理
      encoding: "utf8", // エンコーディング
    })

    // パース処理
    stream
      .pipe(parser)
      .on("data", (record: GeoloniaAddressRecord) => {
        records.push(record)
      })
      .on("end", () => {
        resolve(records)
      })
      .on("error", (error) => {
        reject(error)
      })
  })
}