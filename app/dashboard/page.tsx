"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { prefectures } from "@/lib/address-data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface PrefectureCount {
  prefCode: string
  prefName: string
  count: number
}

interface CityCount {
  cityCode: string
  cityName: string
  count: number
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [prefectureCounts, setPrefectureCounts] = useState<PrefectureCount[]>([])
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null)
  const [cityCounts, setCityCounts] = useState<CityCount[]>([])
  const [cityLoading, setCityLoading] = useState(false)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/stats")
        if (!response.ok) {
          throw new Error("統計データの取得に失敗しました")
        }
        const data = await response.json()
        setTotalCount(data.totalCount)
        setPrefectureCounts(data.prefectureCounts)
      } catch (error) {
        console.error("統計データの取得エラー:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  useEffect(() => {
    if (!selectedPrefecture) return

    const fetchPrefectureStats = async () => {
      setCityLoading(true)
      try {
        const response = await fetch(`/api/stats/prefecture/${selectedPrefecture}`)
        if (!response.ok) {
          throw new Error("都道府県統計データの取得に失敗しました")
        }
        const data = await response.json()
        setCityCounts(data.cityCounts)
      } catch (error) {
        console.error("都道府県統計データの取得エラー:", error)
      } finally {
        setCityLoading(false)
      }
    }

    fetchPrefectureStats()
  }, [selectedPrefecture])

  // 都道府県データをグラフ用に整形
  const prefectureChartData = prefectureCounts.map((item) => ({
    name: item.prefName,
    count: item.count,
  }))

  // 市区町村データをグラフ用に整形
  const cityChartData = cityCounts.map((item) => ({
    name: item.cityName,
    count: item.count,
  }))

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">住所データ統計</CardTitle>
          <CardDescription>Geolonia住所データの統計情報</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <p>データを読み込み中...</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">総住所数</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalCount.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">都道府県数</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{prefectures.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">平均（都道府県あたり）</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Math.round(totalCount / prefectures.length).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="prefecture">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="prefecture">都道府県別</TabsTrigger>
                  <TabsTrigger value="city">市区町村別</TabsTrigger>
                </TabsList>

                <TabsContent value="prefecture">
                  <div className="h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={prefectureChartData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} interval={0} fontSize={12} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" name="住所数" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="city">
                  <div className="mb-4">
                    <Select onValueChange={setSelectedPrefecture}>
                      <SelectTrigger className="w-[250px]">
                        <SelectValue placeholder="都道府県を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {prefectures.map((prefecture) => (
                          <SelectItem key={prefecture.code} value={prefecture.code}>
                            {prefecture.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {cityLoading ? (
                    <div className="flex justify-center items-center p-8">
                      <p>市区町村データを読み込み中...</p>
                    </div>
                  ) : selectedPrefecture ? (
                    cityCounts.length > 0 ? (
                      <div className="h-[500px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={cityChartData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="name"
                              angle={-45}
                              textAnchor="end"
                              height={100}
                              interval={0}
                              fontSize={12}
                            />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#4c1d95" name="住所数" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p>この都道府県の市区町村データはありません</p>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-8">
                      <p>都道府県を選択してください</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}