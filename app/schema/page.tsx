import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DatabaseSchema } from "@/components/database-schema"

export default function SchemaPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">データベース設計</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            このデータベースはGeolonia住所データを使用して、日本の住所情報を管理するために設計されています。
            Geolonia住所データは全国の町丁目レベル（約27万件）の住所データをオープンデータとして提供しており、
            国土交通省位置参照情報をベースにしています。
          </p>
          <p className="mb-4">
            以下のテーブル構造を使用して、住所、都道府県、地方区分の情報を効率的に保存・検索できます。
          </p>
        </CardContent>
      </Card>

      <DatabaseSchema />
    </div>
  )
}