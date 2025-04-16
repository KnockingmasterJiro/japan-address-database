// Geolonia住所データの構造を定義
export interface AddressData {
  pref_code: string // 都道府県コード
  pref: string // 都道府県名
  city_code: string // 市区町村コード
  city: string // 市区町村名
  town_code: string // 町丁目コード
  town: string // 町丁目名
  koaza: string // 小字名（ある場合）
  lat: number // 緯度
  lng: number // 経度
}

// 都道府県データ
export const prefectures = [
  { code: "01", name: "北海道", region: "北海道" },
  { code: "02", name: "青森県", region: "東北" },
  { code: "03", name: "岩手県", region: "東北" },
  { code: "04", name: "宮城県", region: "東北" },
  { code: "05", name: "秋田県", region: "東北" },
  { code: "06", name: "山形県", region: "東北" },
  { code: "07", name: "福島県", region: "東北" },
  { code: "08", name: "茨城県", region: "関東" },
  { code: "09", name: "栃木県", region: "関東" },
  { code: "10", name: "群馬県", region: "関東" },
  { code: "11", name: "埼玉県", region: "関東" },
  { code: "12", name: "千葉県", region: "関東" },
  { code: "13", name: "東京都", region: "関東" },
  { code: "14", name: "神奈川県", region: "関東" },
  { code: "15", name: "新潟県", region: "中部" },
  { code: "16", name: "富山県", region: "中部" },
  { code: "17", name: "石川県", region: "中部" },
  { code: "18", name: "福井県", region: "中部" },
  { code: "19", name: "山梨県", region: "中部" },
  { code: "20", name: "長野県", region: "中部" },
  { code: "21", name: "岐阜県", region: "中部" },
  { code: "22", name: "静岡県", region: "中部" },
  { code: "23", name: "愛知県", region: "中部" },
  { code: "24", name: "三重県", region: "近畿" },
  { code: "25", name: "滋賀県", region: "近畿" },
  { code: "26", name: "京都府", region: "近畿" },
  { code: "27", name: "大阪府", region: "近畿" },
  { code: "28", name: "兵庫県", region: "近畿" },
  { code: "29", name: "奈良県", region: "近畿" },
  { code: "30", name: "和歌山県", region: "近畿" },
  { code: "31", name: "鳥取県", region: "中国" },
  { code: "32", name: "島根県", region: "中国" },
  { code: "33", name: "岡山県", region: "中国" },
  { code: "34", name: "広島県", region: "中国" },
  { code: "35", name: "山口県", region: "中国" },
  { code: "36", name: "徳島県", region: "四国" },
  { code: "37", name: "香川県", region: "四国" },
  { code: "38", name: "愛媛県", region: "四国" },
  { code: "39", name: "高知県", region: "四国" },
  { code: "40", name: "福岡県", region: "九州" },
  { code: "41", name: "佐賀県", region: "九州" },
  { code: "42", name: "長崎県", region: "九州" },
  { code: "43", name: "熊本県", region: "九州" },
  { code: "44", name: "大分県", region: "九州" },
  { code: "45", name: "宮崎県", region: "九州" },
  { code: "46", name: "鹿児島県", region: "九州" },
  { code: "47", name: "沖縄県", region: "九州" },
]

// 地方区分
export const regions = [
  { id: "hokkaido", name: "北海道" },
  { id: "tohoku", name: "東北" },
  { id: "kanto", name: "関東" },
  { id: "chubu", name: "中部" },
  { id: "kinki", name: "近畿" },
  { id: "chugoku", name: "中国" },
  { id: "shikoku", name: "四国" },
  { id: "kyushu", name: "九州" },
]

// 実際のアプリケーションでは、Geoloniaのデータを取得する関数
export async function fetchGeoloniaAddressData(prefCode?: string, limit = 100): Promise<AddressData[]> {
  // データベースからデータを取得する
  try {
    const response = await fetch(`/api/addresses${prefCode ? `?prefecture=${prefCode}` : ""}&limit=${limit}`)
    if (!response.ok) {
      throw new Error("住所データの取得に失敗しました")
    }
    const data = await response.json()
    return data.addresses
  } catch (error) {
    console.error("住所データの取得エラー:", error)
    return []
  }
}