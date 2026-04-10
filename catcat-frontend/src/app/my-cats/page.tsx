'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, Star, Home, Crown, Trash2 } from 'lucide-react'
import { catApi, type Cat } from '@/lib/api'
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const CatModel3D = dynamic(() => import('@/components/CatModel3D'), { ssr: false })

export default function MyCatsPage() {
  const [cats, setCats] = useState<Cat[]>([])
  const [loading, setLoading] = useState(true)
  const [settingCurrent, setSettingCurrent] = useState<number | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)

  const { isLoggedIn, isLoading: authLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push('/login')
      return
    }
    if (isLoggedIn) {
      loadCats()
    }
  }, [isLoggedIn, authLoading, router])

  const loadCats = async () => {
    try {
      const response = await catApi.getMyCats()
      if (response.success) {
        setCats(response.data)
      }
    } catch (error) {
      console.error('Failed to load cats:', error)
    } finally {
      setLoading(false)
    }
  }

  const setCurrentCat = async (catId: number) => {
    setSettingCurrent(catId)
    try {
      await catApi.setCurrent(catId)
      setCats(cats.map(cat => ({
        ...cat,
        isCurrent: cat.id === catId
      })))
    } catch (error) {
      console.error('Failed to set current cat:', error)
    } finally {
      setSettingCurrent(null)
    }
  }

  const deleteCat = async (catId: number) => {
    if (!confirm('确定要放生这只猫猫吗？')) return

    setDeleting(catId)
    try {
      await catApi.delete(catId)
      setCats(cats.filter(cat => cat.id !== catId))
    } catch (error) {
      console.error('Failed to delete cat:', error)
    } finally {
      setDeleting(null)
    }
  }

  const currentCat = cats.find(cat => cat.isCurrent)

  return (
    <div className="min-h-screen bg-cream">
      
      {/* Header */}
      <section className="py-16 px-4 bg-gradient-to-b from-caramel/10 to-cream">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-warmblack mb-4">
            我的猫咪
          </h1>
          <p className="text-warmblack/60 font-body text-lg">
            {cats.length > 0 ? `共 ${cats.length} 只猫咪` : '还没有猫咪，快去领养吧！'}
          </p>
        </div>
      </section>

      {/* Current Cat Section */}
      {currentCat && (
        <section className="px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-caramel rounded-3xl p-6 md:p-8 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5" />
                <span className="font-display font-semibold">当前猫咪</span>
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden bg-white/20 flex-shrink-0">
                  <CatModel3D animation="Idle" enableDrag scale={0.5} />
                </div>
                <div className="flex-1">
                  <h2 className="font-display text-3xl font-bold mb-2">
                    {currentCat.name}
                  </h2>
                  <p className="text-white/80 font-body mb-4">
                    {currentCat.breedName}
                  </p>
                  <div className="flex gap-3">
                    <Link
                      href="/room"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white text-caramel font-display font-semibold rounded-xl hover:bg-cream transition-colors"
                    >
                      <Home size={18} />
                      进入房间
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Cats Grid */}
      <section className="px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-12 h-12 border-4 border-caramel border-t-transparent rounded-full" />
            </div>
          ) : cats.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-8xl mb-6 block">😿</span>
              <p className="text-warmblack/60 font-body text-lg mb-6">
                你还没有领养任何猫咪
              </p>
              <Link
                href="/adopt"
                className="inline-flex items-center gap-2 px-6 py-3 bg-caramel text-white font-display font-semibold rounded-xl hover:bg-caramel-600 transition-colors"
              >
                <Heart size={18} />
                去领养
              </Link>
            </div>
          ) : (
            <>
              <h2 className="font-display text-2xl font-bold text-warmblack mb-6">
                所有猫咪
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cats.map((cat) => (
                  <div
                    key={cat.id}
                    className={`bg-white rounded-2xl overflow-hidden shadow-lg shadow-warmblack/5 card-hover relative ${
                      cat.isCurrent ? 'ring-4 ring-caramel' : ''
                    }`}
                  >
                    {cat.isCurrent && (
                      <div className="absolute top-3 right-3 z-10 bg-caramel text-white px-3 py-1 rounded-full font-display text-xs font-semibold flex items-center gap-1">
                        <Crown size={12} />
                        当前
                      </div>
                    )}

                    <div className="aspect-square relative bg-caramel/10">
                      <CatModel3D animation="Idle" scale={0.4} />
                    </div>

                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-display text-lg font-bold text-warmblack">
                          {cat.name}
                        </h3>
                      </div>
                      <p className="text-warmblack/60 font-body text-sm mb-3">
                        {cat.breedName}
                      </p>
                      <p className="text-warmblack/40 font-mono text-xs truncate mb-4">
                        {cat.dna}
                      </p>

                      {!cat.isCurrent && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setCurrentCat(cat.id)}
                            disabled={settingCurrent === cat.id}
                            className="flex-1 py-2 border-2 border-caramel text-caramel font-display font-semibold rounded-xl hover:bg-caramel hover:text-white transition-colors flex items-center justify-center gap-2"
                          >
                            <Star size={16} className={settingCurrent === cat.id ? 'animate-spin' : ''} />
                            {settingCurrent === cat.id ? '设置中...' : '设为当前'}
                          </button>
                          <button
                            onClick={() => deleteCat(cat.id)}
                            disabled={deleting === cat.id}
                            className="px-3 py-2 border-2 border-red-400 text-red-400 font-display font-semibold rounded-xl hover:bg-red-400 hover:text-white transition-colors flex items-center justify-center"
                            title="放生猫猫"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
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
