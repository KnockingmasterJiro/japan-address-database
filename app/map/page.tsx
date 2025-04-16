"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { prefectures, fetchGeoloniaAddressData, type AddressData } from "@/lib/address-data"

export default function MapPage() {
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null)
  const [addressData, setAddressData] = useState<AddressData[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const data = await fetchGeoloniaAddressData(selectedPrefecture || undefined)
        setAddressData(data)
      } catch (error) {
        console.error("データの取得に失敗しました:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [selectedPrefecture])

  // 実際のアプリケーションでは、ここで地図ライブラリを使用して地図を表示
  // 例: Leaflet, Mapbox, Google Maps など

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">住所マップ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select onValueChange={setSelectedPrefecture}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="都道府県を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべての都道府県</SelectItem>
                {prefectures.map((prefecture) => (
                  <SelectItem key={prefecture.code} value={prefecture.code}>
                    {prefecture.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-muted h-[500px] rounded-md flex items-center justify-center">
            {loading ? (
              <p>地図データを読み込み中...</p>
            ) : (
              <div className="text-center">
                <p>ここに地図が表示されます</p>
                <p className="text-sm text-muted-foreground mt-2">
                  実際のアプリケーションでは、Leaflet、Mapbox、Google Mapsなどの地図ライブラリを使用して
                  <br />
                  Geolonia住所データの緯度・経度情報を元に地図上にマーカーを表示します。
                </p>
                {addressData.length > 0 && (
                  <div className="mt-4 text-sm">
                    <p>選択された地域のデータ: {addressData.length}件</p>
                    <p>
                      中心座標: 緯度 {addressData[0].lat.toFixed(6)}, 経度 {addressData[0].lng.toFixed(6)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}