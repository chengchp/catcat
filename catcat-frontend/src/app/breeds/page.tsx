'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Heart, ArrowRight, MapPin, Home, Cat, Sofa, User } from 'lucide-react'
import { breedApi, type Breed } from '@/lib/api'

// 侧边导航组件
function SideNav() {
  return (
    <nav className="side-nav">
      <Link href="/" className="nav-logo">
        <span className="logo-icon">🐱</span>
        <span className="logo-text">CatCat</span>
      </Link>
      <ul className="nav-links">
        <li>
          <Link href="/">
            <Home size={20} />
            <span>首页</span>
          </Link>
        </li>
        <li className="active">
          <Link href="/breeds">
            <Search size={20} />
            <span>探索</span>
          </Link>
        </li>
        <li>
          <Link href="/adopt">
            <Heart size={20} />
            <span>领养</span>
          </Link>
        </li>
        <li>
          <Link href="/my-cats">
            <Cat size={20} />
            <span>我的猫</span>
          </Link>
        </li>
        <li>
          <Link href="/room">
            <Sofa size={20} />
            <span>房间</span>
          </Link>
        </li>
      </ul>
      <div className="nav-user">
        <Link href="/login">
          <User size={20} />
        </Link>
      </div>
    </nav>
  )
}

// 移动端底部导航
function MobileNav() {
  return (
    <nav className="mobile-nav">
      <Link href="/">
        <Home size={20} />
        <span>首页</span>
      </Link>
      <Link href="/breeds" className="active">
        <Search size={20} />
        <span>探索</span>
      </Link>
      <Link href="/adopt">
        <Heart size={20} />
        <span>领养</span>
      </Link>
      <Link href="/my-cats">
        <Cat size={20} />
        <span>我的猫</span>
      </Link>
      <Link href="/room">
        <Sofa size={20} />
        <span>房间</span>
      </Link>
    </nav>
  )
}

// 原产地国旗映射
const originFlags: Record<string, string> = {
  'United Kingdom': '🇬🇧',
  'USA': '🇺🇸',
  'Thailand': '🇹🇭',
  'Persia': '🇮🇷',
  'Russia': '🇷🇺',
  'Egypt': '🇪🇬',
  'Japan': '🇯🇵',
  'China': '🇨🇳',
  'Germany': '🇩🇪',
  'France': '🇫🇷',
  'Australia': '🇦🇺',
  'Canada': '🇨🇦',
  'Brazil': '🇧🇷',
  'Norway': '🇳🇴',
  'Sweden': '🇸🇪',
  'Finland': '🇫🇮',
  'Denmark': '🇩🇰',
  'Netherlands': '🇳🇱',
  'Belgium': '🇧🇪',
  'Switzerland': '🇨🇭',
  'Austria': '🇦🇹',
  'Spain': '🇪🇸',
  'Portugal': '🇵🇹',
  'Italy': '🇮🇹',
  'Greece': '🇬🇷',
  'Turkey': '🇹🇷',
  'India': '🇮🇳',
  'Ireland': '🇮🇪',
  'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'Burma': '🇲🇲',
  'Israel': '🇮🇱',
  'Iran': '🇮🇷',
  'Singapore': '🇸🇬',
  'Cyprus': '🇨🇾',
}

function getFlag(origin: string): string {
  return originFlags[origin] || '🌍'
}

// 获取唯一原产地列表
function getUniqueOrigins(breeds: Breed[]): string[] {
  const origins = breeds.map(b => b.origin).filter(Boolean)
  return Array.from(new Set(origins)).sort()
}

export default function BreedsPage() {
  const [breeds, setBreeds] = useState<Breed[]>([])
  const [loading, setLoading] = useState(true)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedOrigin, setSelectedOrigin] = useState<string | null>(null)
  const [displayCount, setDisplayCount] = useState(12)

  useEffect(() => {
    loadBreeds()
  }, [])

  const loadBreeds = async () => {
    try {
      setLoading(true)
      const response = await breedApi.getAll()
      if (response.success) {
        setBreeds(response.data || [])
      }
    } catch (error) {
      console.error('Failed to load breeds:', error)
    } finally {
      setLoading(false)
    }
  }

  // 筛选后的品种
  const filteredBreeds = useMemo(() => {
    let result = breeds

    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase()
      result = result.filter(
        breed =>
          breed.name.toLowerCase().includes(keyword) ||
          breed.temperament?.toLowerCase().includes(keyword) ||
          breed.origin?.toLowerCase().includes(keyword)
      )
    }

    if (selectedOrigin) {
      result = result.filter(breed => breed.origin === selectedOrigin)
    }

    return result
  }, [breeds, searchKeyword, selectedOrigin])

  // 显示的品种数量
  const displayedBreeds = filteredBreeds.slice(0, displayCount)
  const hasMore = displayCount < filteredBreeds.length

  // 获取唯一原产地
  const origins = useMemo(() => getUniqueOrigins(breeds), [breeds])

  // 热门原产地
  const popularOrigins = ['英国', '美国', '泰国', '日本', '中国', '埃及']

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <SideNav />
        <div className="main-content flex items-center justify-center min-h-screen">
          <div className="animate-spin w-12 h-12 border-4 border-caramel border-t-transparent rounded-full" />
        </div>
        <MobileNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <SideNav />

      <main className="main-content">
        {/* 页面头部 */}
        <header className="page-header">
          <div className="header-content">
            <h1>探索品种</h1>
            <p>全世界 {breeds.length} 种喵星人，总有一款适合你</p>
          </div>
        </header>

        {/* 筛选区域 */}
        <section className="filter-bar">
          <div className="filter-row">
            <div className="search-wrapper">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="搜索品种..."
                className="search-input"
                value={searchKeyword}
                onChange={(e) => {
                  setSearchKeyword(e.target.value)
                  setDisplayCount(12)
                }}
              />
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-chips">
              <button
                className={`chip ${selectedOrigin === null ? 'active' : ''}`}
                onClick={() => {
                  setSelectedOrigin(null)
                  setDisplayCount(12)
                }}
              >
                全部
              </button>
              {origins
                .filter(origin => popularOrigins.some(p => origin.includes(p)))
                .slice(0, 6)
                .map(origin => (
                  <button
                    key={origin}
                    className={`chip ${selectedOrigin === origin ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedOrigin(selectedOrigin === origin ? null : origin)
                      setDisplayCount(12)
                    }}
                  >
                    <MapPin size={14} />
                    {origin}
                  </button>
                ))}
              {origins.length > 6 &&
                origins
                  .filter(origin => !popularOrigins.some(p => origin.includes(p)))
                  .slice(0, 4)
                  .map(origin => (
                    <button
                      key={origin}
                      className={`chip ${selectedOrigin === origin ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedOrigin(selectedOrigin === origin ? null : origin)
                        setDisplayCount(12)
                      }}
                    >
                      <MapPin size={14} />
                      {origin}
                    </button>
                  ))}
            </div>
          </div>
        </section>

        {/* 结果统计 */}
        <div className="breeds-page-results-info">
          <span>找到 {filteredBreeds.length} 个品种</span>
        </div>

        {/* 品种网格 */}
        {displayedBreeds.length > 0 ? (
          <section className="breeds-page-grid">
            {displayedBreeds.map((breed) => (
              <article key={breed.breedId} className="breed-item card-hover">
                <div className="breed-image">
                  {breed.imageUrl ? (
                    <Image
                      src={breed.imageUrl}
                      alt={breed.name}
                      fill
                      className="object-cover img-zoom"
                      sizes="(max-width: 900px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-caramel/10">
                      <span className="text-7xl">🐱</span>
                    </div>
                  )}
                  <button className="breed-favorite-btn" aria-label="收藏">
                    <Heart size={18} />
                  </button>
                </div>
                <div className="breed-info">
                  <div className="breed-meta">
                    <span className="origin">
                      {breed.origin && (
                        <>
                          {getFlag(breed.origin)} {breed.origin}
                        </>
                      )}
                    </span>
                  </div>
                  <h3>{breed.name}</h3>
                  {breed.temperament && (
                    <p className="breed-trait">
                      {breed.temperament.split(',').slice(0, 2).join('、')}
                    </p>
                  )}
                  <Link href={`/breeds/${breed.breedId}`} className="btn btn-text">
                    查看详情
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <div className="breeds-page-empty">
            <span className="text-6xl mb-4">😿</span>
            <p className="text-warmblack/60 font-body text-lg">
              没有找到匹配的品种
            </p>
            <button
              className="btn btn-outline mt-4"
              onClick={() => {
                setSearchKeyword('')
                setSelectedOrigin(null)
              }}
            >
              清除筛选
            </button>
          </div>
        )}

        {/* 加载更多 */}
        {hasMore && (
          <div className="breeds-page-loadmore">
            <button
              className="btn btn-outline"
              onClick={() => setDisplayCount(prev => prev + 12)}
            >
              加载更多
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Footer */}
        <footer className="py-12 px-4 bg-warmblack text-cream">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-cream/60 font-body">
              © 2024 CatCat. 用爱守护每一只猫咪 🐱
            </p>
          </div>
        </footer>
      </main>

      <MobileNav />
    </div>
  )
}
