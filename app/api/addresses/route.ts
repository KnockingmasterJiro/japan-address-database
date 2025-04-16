import { NextResponse } from "next/server"
import { getAddressesByPrefecture, getTotalAddressCount } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const prefCode = searchParams.get("prefecture")
  const cityCode = searchParams.get("city")
  const query = searchParams.get("query")?.toLowerCase()
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "100")
  const offset = (page - 1) * limit

  try {
    // データベースから住所データを取得
    let addresses = await getAddressesByPrefecture(prefCode || undefined, limit, offset)

    // 市区町村コードでフィルタリング
    if (cityCode) {
      addresses = addresses.filter((address) => address.city_code === cityCode)
    }

    // 検索クエリでフィルタリング
    if (query) {
      addresses = addresses.filter(
        (address) =>
          address.pref.toLowerCase().includes(query) ||
          address.city.toLowerCase().includes(query) ||
          address.town.toLowerCase().includes(query),
      )
    }

    // 総件数を取得
    const totalCount = await getTotalAddressCount()

    return NextResponse.json({
      count: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      addresses,
    })
  } catch (error) {
    console.error("Error fetching address data:", error)
    return NextResponse.json({ error: "Failed to fetch address data" }, { status: 500 })
  }
}