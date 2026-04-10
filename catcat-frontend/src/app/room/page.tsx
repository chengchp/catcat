'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, RotateCcw, Grid } from 'lucide-react'
import { roomApi, type Room, type Furniture } from '@/lib/api'
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const RoomCanvas = dynamic(() => import('@/components/RoomCanvas'), { ssr: false })

export default function RoomPage() {
  const [room, setRoom] = useState<Room | null>(null)
  const [furnitureList, setFurnitureList] = useState<Furniture[]>([])
  const [loading, setLoading] = useState(true)
  const [showFurniturePanel, setShowFurniturePanel] = useState(false)
  const [selectedFurniture, setSelectedFurniture] = useState<Furniture | null>(null)

  const { isLoggedIn, isLoading: authLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push('/login')
      return
    }
    if (isLoggedIn) {
      loadRoom()
      loadFurniture()
    }
  }, [isLoggedIn, authLoading, router])

  const loadRoom = async () => {
    try {
      const response = await roomApi.getMyRoom()
      if (response.success) {
        setRoom(response.data)
      }
    } catch (error) {
      console.error('Failed to load room:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadFurniture = async () => {
    try {
      const response = await roomApi.getAvailableFurniture()
      if (response.success) {
        setFurnitureList(response.data)
      }
    } catch (error) {
      console.error('Failed to load furniture:', error)
    }
  }

  const handlePlaceFurniture = async (furniture: Furniture, gridX: number, gridY: number) => {
    if (!room) return
    try {
      await roomApi.addFurniture(room.id, furniture.id, gridX, gridY, 0)
      await loadRoom()
      setSelectedFurniture(null)
    } catch (error) {
      console.error('Failed to add furniture:', error)
    }
  }

  const handleRemoveFurniture = async (roomFurnitureId: number) => {
    try {
      await roomApi.removeFurniture(roomFurnitureId)
      await loadRoom()
    } catch (error) {
      console.error('Failed to remove furniture:', error)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">

      {/* Header */}
      <section className="py-6 px-4 bg-gradient-to-b from-caramel/10 to-cream">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-warmblack mb-1">
                温馨小窝
              </h1>
              <p className="text-warmblack/60 font-body text-sm">
                {room ? `${room.furniture.length} 件家具` : '加载中...'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => loadRoom()}
                className="p-2 hover:bg-caramel/10 rounded-lg transition-colors"
              >
                <RotateCcw className="w-5 h-5 text-warmblack/60" />
              </button>
              <button
                onClick={() => setShowFurniturePanel(!showFurniturePanel)}
                className="px-4 py-2 bg-caramel text-white font-display font-semibold rounded-xl hover:bg-caramel-600 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                添加家具
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 家具选择面板 */}
      {showFurniturePanel && (
        <section className="px-4 py-3 bg-warmblack/5 border-b border-caramel/10">
          <div className="max-w-6xl mx-auto">
            <p className="text-sm text-warmblack/60 mb-2">
              {selectedFurniture
                ? `已选择: ${selectedFurniture.name}，点击 3D 房间地板放置`
                : '选择一件家具，然后点击房间地板放置'}
            </p>
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {furnitureList.map((furniture) => (
                <button
                  key={furniture.id}
                  onClick={() => setSelectedFurniture(
                    selectedFurniture?.id === furniture.id ? null : furniture
                  )}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                    selectedFurniture?.id === furniture.id
                      ? 'ring-4 ring-caramel bg-caramel/10'
                      : 'bg-white hover:ring-2 hover:ring-caramel'
                  }`}
                >
                  <span className="text-3xl">{furniture.emoji}</span>
                  <span className="text-xs text-warmblack/60">{furniture.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3D 房间 */}
      <section className="flex-1 px-4 py-4">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-12 h-12 border-4 border-caramel border-t-transparent rounded-full" />
            </div>
          ) : room ? (
            <div className="grid lg:grid-cols-4 gap-4">
              {/* 3D 画布 */}
              <div className="lg:col-span-3 bg-white rounded-2xl overflow-hidden shadow-xl" style={{ height: '500px' }}>
                <RoomCanvas
                  room={room}
                  selectedFurniture={selectedFurniture}
                  onPlaceFurniture={handlePlaceFurniture}
                  onRemoveFurniture={handleRemoveFurniture}
                />
              </div>

              {/* 家具列表 */}
              <div className="bg-white rounded-2xl p-4 shadow-xl">
                <h3 className="font-display font-bold text-warmblack mb-3 flex items-center gap-2 text-sm">
                  <Grid size={16} />
                  房间物品
                </h3>
                {room.furniture.length === 0 ? (
                  <div className="text-center py-6">
                    <span className="text-4xl mb-2 block">🏠</span>
                    <p className="text-warmblack/60 font-body text-sm">房间空空如也</p>
                    <p className="text-warmblack/40 font-body text-xs mt-1">点击上方添加家具</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 lg:grid-cols-2 gap-2">
                    {room.furniture.map((item) => (
                      <div
                        key={item.id}
                        className="bg-cream rounded-xl p-2 flex flex-col items-center relative group cursor-pointer hover:bg-caramel/10 transition-colors"
                        onClick={() => handleRemoveFurniture(item.id)}
                      >
                        <span className="text-2xl mb-1">{item.emoji}</span>
                        <span className="text-xs text-warmblack/60 truncate w-full text-center">{item.name}</span>
                        <div className="absolute top-1 right-1 w-5 h-5 bg-warmblack/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Trash2 className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <span className="text-8xl mb-6 block">🏠</span>
              <p className="text-warmblack/60 font-body text-lg mb-6">
                还没有房间
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-warmblack text-cream">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-cream/60 font-body">
            © 2024 CatCat. 用爱守护每一只猫咪 🐱
          </p>
        </div>
      </footer>
    </div>
  )
}
