"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { prefectures, regions, fetchGeoloniaAddressData, type AddressData } from "@/lib/address-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AddressDatabase() {
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [addressData, setAddressData] = useState<AddressData[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("prefectures")

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

  // 都道府県をフィルタリング
  const filteredPrefectures = prefectures.filter((prefecture) => {
    const matchesRegion = !selectedRegion || prefecture.region === selectedRegion
    const matchesSearch =
      !searchQuery ||
      prefecture.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prefecture.code.includes(searchQuery)

    return matchesRegion && matchesSearch
  })

  // 住所データをフィルタリング
  const filteredAddresses = addressData.filter((address) => {
    const matchesSearch =
      !searchQuery ||
      address.pref.includes(searchQuery) ||
      address.city.includes(searchQuery) ||
      address.town.includes(searchQuery)

    return matchesSearch
  })

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">日本の住所データベース</CardTitle>
          <CardDescription>Geolonia住所データを使用した全国の住所データベース</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="prefectures">都道府県</TabsTrigger>
              <TabsTrigger value="addresses">詳細住所</TabsTrigger>
            </TabsList>

            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {activeTab === "prefectures" && (
                  <div>
                    <Select onValueChange={setSelectedRegion}>
                      <SelectTrigger>
                        <SelectValue placeholder="地方を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">すべての地方</SelectItem>
                        {regions.map((region) => (
                          <SelectItem key={region.id} value={region.name}>
                            {region.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {activeTab === "addresses" && (
                  <div>
                    <Select onValueChange={setSelectedPrefecture}>
                      <SelectTrigger>
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
                )}

                <div className="flex gap-2">
                  <Input
                    placeholder={activeTab === "prefectures" ? "都道府県名で検索" : "住所で検索"}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button variant="outline" onClick={() => setSearchQuery("")} disabled={!searchQuery}>
                    クリア
                  </Button>
                </div>
              </div>
            </div>

            <TabsContent value="prefectures" className="mt-4">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>コード</TableHead>
                        <TableHead>都道府県</TableHead>
                        <TableHead>地方</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPrefectures.length > 0 ? (
                        filteredPrefectures.map((prefecture) => (
                          <TableRow
                            key={prefecture.code}
                            className="cursor-pointer hover:bg-muted"
                            onClick={() => {
                              setSelectedPrefecture(prefecture.code)
                              setActiveTab("addresses")
                            }}
                          >
                            <TableCell>{prefecture.code}</TableCell>
                            <TableCell>{prefecture.name}</TableCell>
                            <TableCell>{prefecture.region}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4">
                            該当する都道府県が見つかりませんでした
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="addresses" className="mt-4">
              <Card>
                <CardContent className="p-0">
                  {loading ? (
                    <div className="flex justify-center items-center p-8">
                      <p>データを読み込み中...</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>都道府県</TableHead>
                          <TableHead>市区町村</TableHead>
                          <TableHead>町丁目</TableHead>
                          <TableHead className="hidden md:table-cell">緯度</TableHead>
                          <TableHead className="hidden md:table-cell">経度</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAddresses.length > 0 ? (
                          filteredAddresses.map((address, index) => (
                            <TableRow key={index}>
                              <TableCell>{address.pref}</TableCell>
                              <TableCell>{address.city}</TableCell>
                              <TableCell>{address.town}</TableCell>
                              <TableCell className="hidden md:table-cell">{address.lat}</TableCell>
                              <TableCell className="hidden md:table-cell">{address.lng}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-4">
                              該当する住所が見つかりませんでした
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}