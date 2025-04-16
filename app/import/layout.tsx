import type React from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ImportLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="import" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="import" asChild>
            <a href="/import">インポート</a>
          </TabsTrigger>
          <TabsTrigger value="status" asChild>
            <a href="/import/status">処理状況</a>
          </TabsTrigger>
        </TabsList>
        <div>{children}</div>
      </Tabs>
    </div>
  )
}