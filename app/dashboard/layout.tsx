import type React from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
          <TabsTrigger value="dashboard" asChild>
            <a href="/dashboard">統計情報</a>
          </TabsTrigger>
          <TabsTrigger value="import" asChild>
            <a href="/import">インポート</a>
          </TabsTrigger>
          <TabsTrigger value="browse" asChild>
            <a href="/">データ閲覧</a>
          </TabsTrigger>
        </TabsList>
        <div>{children}</div>
      </Tabs>
    </div>
  )
}