import { neon } from "@neondatabase/serverless"
import { PrismaClient } from "@prisma/client"
import type { AddressData } from "./address-data"
import { prefectures, regions } from "./address-data"

// PrismaClientのグローバルインスタンスを作成
const globalForPrisma = global as unknown as { prisma: PrismaClient }

// 開発環境で複数のPrismaClientインスタンスが作成されるのを防ぐ
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// SQL実行用のNeonクライアント
export const sql = neon(process.env.DATABASE_URL!)

// 初期データのセットアップ（都道府県と地方区分）
export async function setupInitialData() {
  // 地方区分の登録
  const regionCount = await prisma.region.count()
  if (regionCount === 0) {
    await prisma.region.createMany({
      data: regions.map((region) => ({
        id: region.id,
        name: region.name,
      })),
      skipDuplicates: true,
    })
    console.log(`${regions.length}件の地方区分を登録しました`)
  }

  // 都道府県の登録
  const prefectureCount = await prisma.prefecture.count()
  if (prefectureCount === 0) {
    await prisma.prefecture.createMany({
      data: prefectures.map((prefecture) => ({
        code: prefecture.code,
        name: prefecture.name,
        region: prefecture.region,
      })),
      skipDuplicates: true,
    })
    console.log(`${prefectures.length}件の都道府県を登録しました`)
  }
}

// 住所データをデータベースに保存する関数
export async function saveAddressesToDatabase(addresses: AddressData[]): Promise<number> {
  if (addresses.length === 0) return 0

  // 市区町村の登録（存在しない場合のみ）
  const cityData = addresses.map((address) => ({
    code: address.city_code,
    name: address.city,
    prefCode: address.pref_code,
  }))

  // 重複を除去
  const uniqueCities = cityData.filter((city, index, self) => index === self.findIndex((c) => c.code === city.code))

  // 市区町村の一括登録
  await prisma.city.createMany({
    data: uniqueCities,
    skipDuplicates: true,
  })

  // 住所データの登録
  const addressData = addresses.map((address) => ({
    prefCode: address.pref_code,
    cityCode: address.city_code,
    townCode: address.town_code,
    town: address.town,
    koaza: address.koaza || null,
    lat: address.lat,
    lng: address.lng,
  }))

  // 住所の一括登録
  const result = await prisma.address.createMany({
    data: addressData,
    skipDuplicates: true,
  })

  return result.count
}

// バッチ処理用の関数（大量データを分割して処理）
export async function batchProcessAddresses(
  addresses: AddressData[],
  batchSize = 1000,
  onProgress?: (processed: number, total: number) => void,
): Promise<number> {
  let processed = 0
  const total = addresses.length

  // 初期データのセットアップ
  await setupInitialData()

  // バッチ処理
  for (let i = 0; i < total; i += batchSize) {
    const batch = addresses.slice(i, i + batchSize)
    const count = await saveAddressesToDatabase(batch)

    processed += count

    // 進捗状況のコールバック
    if (onProgress) {
      onProgress(processed, total)
    }
  }

  return processed
}

// データベースから住所データを取得する関数
export async function getAddressesByPrefecture(prefCode?: string, limit = 1000, offset = 0): Promise<AddressData[]> {
  try {
    let query = {}

    if (prefCode) {
      query = { prefCode }
    }

    const addresses = await prisma.address.findMany({
      where: query,
      include: {
        prefecture: true,
        city: true,
      },
      take: limit,
      skip: offset,
    })

    return addresses.map((address) => ({
      pref_code: address.prefCode,
      pref: address.prefecture.name,
      city_code: address.cityCode,
      city: address.city.name,
      town_code: address.townCode,
      town: address.town,
      koaza: address.koaza || "",
      lat: address.lat,
      lng: address.lng,
    }))
  } catch (error) {
    console.error("住所データの取得エラー:", error)
    return []
  }
}

// 住所データの総数を取得する関数
export async function getTotalAddressCount(): Promise<number> {
  return prisma.address.count()
}

// 都道府県ごとの住所データ数を取得する関数
export async function getAddressCountByPrefecture(): Promise<{ prefCode: string; prefName: string; count: number }[]> {
  const counts = await prisma.$queryRaw`
    SELECT 
      p.code as "prefCode", 
      p.name as "prefName", 
      COUNT(a.id) as count 
    FROM addresses a
    JOIN prefectures p ON a."prefCode" = p.code
    GROUP BY p.code, p.name
    ORDER BY p.code
  `
  return counts as { prefCode: string; prefName: string; count: number }[]
}

// 市区町村ごとの住所データ数を取得する関数
export async function getAddressCountByCity(
  prefCode: string,
): Promise<{ cityCode: string; cityName: string; count: number }[]> {
  const counts = await prisma.$queryRaw`
    SELECT 
      c.code as "cityCode", 
      c.name as "cityName", 
      COUNT(a.id) as count 
    FROM addresses a
    JOIN cities c ON a."cityCode" = c.code
    WHERE a."prefCode" = ${prefCode}
    GROUP BY c.code, c.name
    ORDER BY c.code
  `
  return counts as { cityCode: string; cityName: string; count: number }[]
}