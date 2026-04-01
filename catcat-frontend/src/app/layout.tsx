import type { Metadata } from 'next'
import '@/styles/globals.css'
import { Layout } from '@/components/Layout'

export const metadata: Metadata = {
  title: 'CatCat - 你的猫猫社区',
  description: '探索猫猫品种的奥秘，云领养一只属于你的虚拟猫咪，布置温馨小窝',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
