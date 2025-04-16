import type { Metadata } from "next";
// @vercel/fontsのインポートを削除または代替フォントに変更
import { Inter } from 'next/font/google';
import "./globals.css";

// Interフォントを使用する例
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "日本住所データベース",
  description: "日本の住所データを管理するアプリケーション",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
