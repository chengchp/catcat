'use client'

import { useState, useEffect } from 'react'
import { Grid, Plus, Trash2, RotateCcw } from 'lucide-react'
import { roomApi, type Room, type Furniture } from '@/lib/api'
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'

export default function RoomPage() {
  const [room, setRoom] = useState<Room | null>(null)
  const [furnitureList, setFurnitureList] = useState<Furniture[]>([])
  const [loading, setLoading] = useState(true)
  const [showFurniturePanel, setShowFurniturePanel] = useState(false)
  const [selectedFurniture, setSelectedFurniture] = useState<Furniture | null>(null)
  const [addingToPosition, setAddingToPosition] = useState<{x: number, y: number} | null>(null)

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

  const handleAddFurniture = async (furniture: Furniture, positionX: number, positionY: number) => {
    if (!room) return

    try {
      await roomApi.addFurniture(room.id, furniture.id, positionX, positionY, 0)
      await loadRoom()
      setShowFurniturePanel(false)
      setSelectedFurniture(null)
      setAddingToPosition(null)
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

  const handleFurnitureSelect = (furniture: Furniture) => {
    setSelectedFurniture(furniture)
    setAddingToPosition(null)
  }

  // 渲染房间网格
  const renderRoomGrid = () => {
    const grid: (typeof room.furniture)[0] | null[][] = Array(7).fill(null).map(() =>
      Array(7).fill(null)
    )

    // 放置家具
    room?.furniture.forEach((item) => {
      if (item.positionY >= 0 && item.positionY <= 6 &&
          item.positionX >= 0 && item.positionX <= 6) {
        grid[item.positionY][item.positionX] = item
      }
    })

    return (
      <div className="bg-white rounded-3xl p-4 shadow-xl">
        <div className="grid grid-cols-7 gap-1 aspect-square">
          {grid.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className="aspect-square bg-cream rounded-lg flex items-center justify-center text-2xl border border-caramel/10 relative group cursor-pointer"
                onClick={() => {
                  if (selectedFurniture && !cell) {
                    handleAddFurniture(selectedFurniture, x, y)
                  }
                }}
              >
                {cell ? (
                  <>
                    <span className="text-3xl">{cell.emoji}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveFurniture(cell.id)
                      }}
                      className="absolute inset-0 bg-warmblack/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <Trash2 className="w-6 h-6 text-white" />
                    </button>
                  </>
                ) : selectedFurniture ? (
                  <Plus className="w-6 h-6 text-caramel/50" />
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">

      {/* Header */}
      <section className="py-8 px-4 bg-gradient-to-b from-caramel/10 to-cream">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-warmblack mb-2">
                温馨小窝
              </h1>
              <p className="text-warmblack/60 font-body">
                为你的猫咪布置一个舒适的家
              </p>
            </div>
            <button
              onClick={() => setShowFurniturePanel(!showFurniturePanel)}
              className="px-4 py-2 bg-caramel text-white font-display font-semibold rounded-xl hover:bg-caramel-600 transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              添加家具
            </button>
          </div>
        </div>
      </section>

      {/* Furniture Panel */}
      {showFurniturePanel && (
        <section className="px-4 py-4 bg-warmblack/5 border-b border-caramel/10">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-warmblack/60 mb-2">选择一件家具，然后点击房间中的格子放置</p>
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              {furnitureList.map((furniture) => (
                <button
                  key={furniture.id}
                  onClick={() => handleFurnitureSelect(furniture)}
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
            {selectedFurniture && (
              <p className="text-sm text-caramel mt-2">
                已选择: {selectedFurniture.name}，点击房间格子放置
              </p>
            )}
          </div>
        </section>
      )}

      {/* Room Display */}
      <section className="flex-1 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-12 h-12 border-4 border-caramel border-t-transparent rounded-full" />
            </div>
          ) : room ? (
            <>
              {/* Room Info */}
              <div className="bg-white rounded-2xl p-4 mb-6 flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold text-warmblack">{room.name}</h2>
                  <p className="text-warmblack/60 font-body text-sm">
                    {room.furniture.length} 件家具
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => loadRoom()}
                    className="p-2 hover:bg-caramel/10 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-5 h-5 text-warmblack/60" />
                  </button>
                </div>
              </div>

              {/* Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {renderRoomGrid()}

                {/* Furniture List */}
                <div className="bg-white rounded-3xl p-6 shadow-xl">
                  <h3 className="font-display font-bold text-warmblack mb-4 flex items-center gap-2">
                    <Grid size={20} />
                    房间物品
                  </h3>
                  {room.furniture.length === 0 ? (
                    <div className="text-center py-8">
                      <span className="text-5xl mb-3 block">🏠</span>
                      <p className="text-warmblack/60 font-body">房间空空如也</p>
                      <p className="text-warmblack/40 font-body text-sm">点击上方添加家具</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {room.furniture.map((item) => (
                        <div
                          key={item.id}
                          className="bg-cream rounded-xl p-3 flex flex-col items-center relative group"
                        >
                          <span className="text-3xl mb-1">{item.emoji}</span>
                          <span className="text-xs text-warmblack/60">{item.name}</span>
                          <button
                            onClick={() => handleRemoveFurniture(item.id)}
                            className="absolute top-1 right-1 w-6 h-6 bg-warmblack/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <Trash2 className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
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
