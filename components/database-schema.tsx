import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function DatabaseSchema() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>住所データテーブル (addresses)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>カラム名</TableHead>
                <TableHead>データ型</TableHead>
                <TableHead>説明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>id</TableCell>
                <TableCell>INTEGER</TableCell>
                <TableCell>主キー、自動増分</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>pref_code</TableCell>
                <TableCell>VARCHAR(2)</TableCell>
                <TableCell>都道府県コード (JIS X 0401)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>pref</TableCell>
                <TableCell>VARCHAR(10)</TableCell>
                <TableCell>都道府県名</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>city_code</TableCell>
                <TableCell>VARCHAR(5)</TableCell>
                <TableCell>市区町村コード</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>city</TableCell>
                <TableCell>VARCHAR(50)</TableCell>
                <TableCell>市区町村名</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>town_code</TableCell>
                <TableCell>VARCHAR(12)</TableCell>
                <TableCell>町丁目コード</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>town</TableCell>
                <TableCell>VARCHAR(100)</TableCell>
                <TableCell>町丁目名</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>koaza</TableCell>
                <TableCell>VARCHAR(100)</TableCell>
                <TableCell>小字名（ある場合）</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>lat</TableCell>
                <TableCell>DECIMAL(10,7)</TableCell>
                <TableCell>緯度</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>lng</TableCell>
                <TableCell>DECIMAL(10,7)</TableCell>
                <TableCell>経度</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>都道府県テーブル (prefectures)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>カラム名</TableHead>
                <TableHead>データ型</TableHead>
                <TableHead>説明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>code</TableCell>
                <TableCell>VARCHAR(2)</TableCell>
                <TableCell>都道府県コード (JIS X 0401)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>name</TableCell>
                <TableCell>VARCHAR(10)</TableCell>
                <TableCell>都道府県名</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>region</TableCell>
                <TableCell>VARCHAR(10)</TableCell>
                <TableCell>地方区分 (関東、近畿など)</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>地方区分テーブル (regions)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>カラム名</TableHead>
                <TableHead>データ型</TableHead>
                <TableHead>説明</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>id</TableCell>
                <TableCell>VARCHAR(20)</TableCell>
                <TableCell>地方区分ID</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>name</TableCell>
                <TableCell>VARCHAR(10)</TableCell>
                <TableCell>地方区分名 (北海道、東北、関東など)</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}