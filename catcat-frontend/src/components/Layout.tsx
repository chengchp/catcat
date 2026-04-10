'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Heart, Cat, Sofa, User, LogOut } from 'lucide-react'
import { UserProvider, useUser } from '@/context/UserContext'

const navItems = [
  { href: '/', label: '首页', icon: Home },
  { href: '/breeds', label: '探索', icon: Search },
  { href: '/adopt', label: '领养', icon: Heart },
  { href: '/my-cats', label: '我的猫', icon: Cat },
  { href: '/room', label: '房间', icon: Sofa },
]

function UserNav() {
  const { user, isLoggedIn, logout } = useUser()
  const pathname = usePathname()

  if (isLoggedIn) {
    return (
      <div className="nav-user-dropdown">
        <Link href="/profile" className="nav-user-link">
          <User size={20} />
          <span className="nav-user-name">{user?.nickname || user?.username || '用户'}</span>
        </Link>
        <button onClick={() => logout()} className="nav-logout-btn" title="退出登录">
          <LogOut size={18} />
        </button>
      </div>
    )
  }

  return (
    <div className="nav-user">
      <Link href="/login" className={pathname === '/login' ? 'active' : ''}>
        <User size={20} />
      </Link>
    </div>
  )
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/login' || pathname === '/register'

  return (
    <>
      {/* 左侧固定导航 - 桌面端（登录/注册页隐藏） */}
      {!isAuthPage && (
        <nav className="side-nav">
          <Link href="/" className="nav-logo">
            <span className="logo-icon">🐾</span>
            <span className="logo-text">CatCat</span>
          </Link>

          <ul className="nav-links">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <li key={item.href} className={isActive ? 'active' : ''}>
                  <Link href={item.href}>
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>

          <UserNav />
        </nav>
      )}

      {/* 主内容区 */}
      <main className={`main-content${isAuthPage ? ' fullscreen' : ''}`}>
        {children}
      </main>

      {/* 移动端底部导航（登录/注册页隐藏） */}
      {!isAuthPage && (
        <nav className="mobile-nav">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} className={isActive ? 'active' : ''}>
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      )}
    </>
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <LayoutContent>{children}</LayoutContent>
    </UserProvider>
  )
}
