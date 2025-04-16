import { NextResponse } from "next/server"
import { getTotalAddressCount, getAddressCountByPrefecture } from "@/lib/db"

export async function GET() {
  try {
    // 総住所数を取得
    const totalCount = await getTotalAddressCount()

    // 都道府県ごとの住所数を取得
    const prefectureCounts = await getAddressCountByPrefecture()

    return NextResponse.json({
      totalCount,
      prefectureCounts,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}