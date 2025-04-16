import { NextResponse } from "next/server"
import { getAddressCountByCity } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { code: string } }) {
  const prefCode = params.code

  try {
    // 市区町村ごとの住所数を取得
    const cityCounts = await getAddressCountByCity(prefCode)

    return NextResponse.json({
      prefCode,
      cityCounts,
    })
  } catch (error) {
    console.error("Error fetching prefecture stats:", error)
    return NextResponse.json({ error: "Failed to fetch prefecture stats" }, { status: 500 })
  }
}