'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { User, Mail, LogOut, Crown, Home, Heart, Settings } from 'lucide-react'
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import { catApi, type Cat } from '@/lib/api'

export default function ProfilePage() {
  const { user, isLoggedIn, isLoading: authLoading, logout } = useUser()
  const [currentCat, setCurrentCat] = useState<Cat | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push('/login')
      return
    }
    if (isLoggedIn) {
      loadCurrentCat()
    }
  }, [isLoggedIn, authLoading, router])

  const loadCurrentCat = async () => {
    try {
      const response = await catApi.getMyCats()
      if (response.success && response.data.length > 0) {
        // 找到当前猫
        const cat = response.data.find(c => c.isCurrent) || response.data[0]
        setCurrentCat(cat)
      }
    } catch (error) {
      console.error('Failed to load cats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  if (authLoading || !isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-12 h-12 border-4 border-caramel border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="profile-page">
      {/* Header */}
      <section className="py-16 px-4 bg-gradient-to-b from-caramel/10 to-cream">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-caramel flex items-center justify-center">
              <User size={48} className="text-white" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-warmblack">
                {user?.nickname || user?.username}
              </h1>
              {user?.email && (
                <p className="text-warmblack/60 font-body flex items-center gap-2 mt-1">
                  <Mail size={14} />
                  {user.email}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Current Cat Section */}
      <section className="px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-xl font-bold text-warmblack mb-4 flex items-center gap-2">
            <Crown size={20} className="text-caramel" />
            当前猫咪
          </h2>

          {loading ? (
            <div className="bg-white rounded-2xl p-6 flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-4 border-caramel border-t-transparent rounded-full" />
            </div>
          ) : currentCat ? (
            <div className="bg-caramel rounded-2xl p-6 text-white">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-white/20 flex-shrink-0">
                  {currentCat.imageUrl ? (
                    <Image
                      src={currentCat.imageUrl}
                      alt={currentCat.name}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      🐱
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-bold">{currentCat.name}</h3>
                  <p className="text-white/80 font-body">
                    {currentCat.breedName}
                  </p>
                  <Link
                    href="/room"
                    className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-white text-caramel font-display font-semibold rounded-xl hover:bg-cream transition-colors text-sm"
                  >
                    <Home size={16} />
                    进入房间
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center">
              <span className="text-6xl mb-4 block">😿</span>
              <p className="text-warmblack/60 font-body mb-4">还没有领养猫咪</p>
              <Link
                href="/adopt"
                className="inline-flex items-center gap-2 px-6 py-3 bg-caramel text-white font-display font-semibold rounded-xl hover:bg-caramel-600 transition-colors"
              >
                <Heart size={18} />
                去领养
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl overflow-hidden">
            <Link href="/my-cats" className="flex items-center gap-4 p-4 hover:bg-cream transition-colors border-b border-cream">
              <div className="w-10 h-10 rounded-full bg-caramel/10 flex items-center justify-center">
                <Heart size={20} className="text-caramel" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold text-warmblack">我的猫咪</h3>
                <p className="text-warmblack/40 font-body text-sm">查看所有猫咪</p>
              </div>
            </Link>

            <Link href="/room" className="flex items-center gap-4 p-4 hover:bg-cream transition-colors border-b border-cream">
              <div className="w-10 h-10 rounded-full bg-caramel/10 flex items-center justify-center">
                <Home size={20} className="text-caramel" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold text-warmblack">我的房间</h3>
                <p className="text-warmblack/40 font-body text-sm">布置温馨小窝</p>
              </div>
            </Link>

            <Link href="/breeds" className="flex items-center gap-4 p-4 hover:bg-cream transition-colors border-b border-cream">
              <div className="w-10 h-10 rounded-full bg-caramel/10 flex items-center justify-center">
                <Settings size={20} className="text-caramel" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold text-warmblack">探索品种</h3>
                <p className="text-warmblack/40 font-body text-sm">浏览所有品种</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Logout */}
      <section className="px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-4 bg-white rounded-2xl text-red-500 font-display font-semibold hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            退出登录
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-warmblack text-cream mt-auto">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-cream/60 font-body">
            © 2024 CatCat. 用爱守护每一只猫咪 🐱
          </p>
        </div>
      </footer>
    </div>
  )
}
