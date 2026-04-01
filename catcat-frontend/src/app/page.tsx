import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles } from 'lucide-react'
import { catApi } from '@/lib/api'
import '@/styles/home.css'

export default async function HomePage() {
  // 获取品种列表
  let breeds: any[] = []
  try {
    const response = await fetch('http://localhost:8080/api/breeds', { cache: 'no-store' })
    if (response.ok) {
      const data = await response.json()
      breeds = data.data?.slice(0, 5) || []
    }
  } catch (error) {
    console.error('Failed to fetch breeds:', error)
  }

  return (
    <div className="home-page">
      {/* Hero 区域 */}
      <section className="hero">
        <div className="hero-visual">
          <Image
            src="https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=1200"
            alt="可爱的暹罗猫"
            fill
            className="object-cover"
            style={{ objectPosition: 'center 15%' }}
            priority
          />
          <div className="hero-overlay" />
        </div>

        <div className="hero-text">
          <h1 className="hero-title">
            <span className="title-deco animate-wiggle inline-block mb-2">🐾</span>
            <span className="line">在 <span className="brand">CatCat</span></span>
            <span className="line accent">做一个快乐的铲屎官</span>
          </h1>
          <p className="hero-desc">
            这里有脾气比主人还大的英短，有拆家能力满级的缅因，还有永远饿着的橘猫。
          </p>
          <div className="hero-actions">
            <Link href="/breeds" className="btn btn-primary">
              逛逛品种
            </Link>
            <Link href="/adopt" className="btn btn-outline">
              随机领养
            </Link>
          </div>
        </div>
      </section>

      {/* 品种展示 */}
      <section className="breeds-section">
        <header className="section-header">
          <h2>热门品种</h2>
          <Link href="/breeds" className="link-more">
            查看全部 <ArrowRight size={16} />
          </Link>
        </header>

        <div className="breeds-grid">
          {breeds.map((breed) => (
            <article key={breed.breedId} className="breed-card card-hover">
              <div className="card-image">
                {breed.imageUrl ? (
                  <Image src={breed.imageUrl} alt={breed.name} fill className="object-cover img-zoom" />
                ) : (
                  <div className="flex items-center justify-center h-full bg-[var(--bg-secondary)]">
                    <span className="text-6xl">🐱</span>
                  </div>
                )}
              </div>
              <div className="card-content">
                <span className="card-tag">短毛</span>
                <h3>{breed.name}</h3>
                <p>{breed.temperament?.split(',')[0] || '可爱的猫咪'}</p>
              </div>
            </article>
          ))}

          {breeds.length === 0 && (
            <>
              <article className="breed-card card-hover">
                <div className="card-image">
                  <Image src="https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600" alt="波斯猫" fill className="object-cover img-zoom" />
                </div>
                <div className="card-content">
                  <span className="card-tag long">长毛</span>
                  <h3>波斯猫</h3>
                  <p>优雅得像在巴黎走秀</p>
                </div>
              </article>
              <article className="breed-card card-hover">
                <div className="card-image">
                  <Image src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400" alt="英短" fill className="object-cover img-zoom" />
                </div>
                <div className="card-content">
                  <span className="card-tag short">短毛</span>
                  <h3>英短</h3>
                  <p>胖到卡住门框</p>
                </div>
              </article>
              <article className="breed-card card-hover">
                <div className="card-image">
                  <Image src="https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400" alt="暹罗" fill className="object-cover img-zoom" />
                </div>
                <div className="card-content">
                  <span className="card-tag short">短毛</span>
                  <h3>暹罗</h3>
                  <p>话比我还多</p>
                </div>
              </article>
              <article className="breed-card card-hover">
                <div className="card-image">
                  <Image src="https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=400" alt="布偶" fill className="object-cover img-zoom" />
                </div>
                <div className="card-content">
                  <span className="card-tag long">长毛</span>
                  <h3>布偶</h3>
                  <p>粘人到令人窒息</p>
                </div>
              </article>
              <article className="breed-card card-hover">
                <div className="card-image">
                  <Image src="https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=400" alt="橘猫" fill className="object-cover img-zoom" />
                </div>
                <div className="card-content">
                  <span className="card-tag short">短毛</span>
                  <h3>橘猫</h3>
                  <p>十只橘猫九只胖</p>
                </div>
              </article>
            </>
          )}
        </div>
      </section>

      {/* 功能介绍 - 左图右文交替 */}
      <section className="features-section">
        {/* 功能1：云领养 */}
        <div className="feature-row">
          <div className="feature-image">
            <Image
              src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=500"
              alt="领养"
              width={500}
              height={375}
              className="rounded-3xl shadow-lg"
            />
          </div>
          <div className="feature-text">
            <span className="feature-label">01</span>
            <h3>云领养</h3>
            <p>不用铲屎，还能拥有猫</p>
            <p>随机匹配，DNA 生成独一无二的外观</p>
            <Link href="/adopt" className="btn btn-text">
              开始领养 <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* 功能2：虚拟房间 */}
        <div className="feature-row reverse">
          <div className="feature-image">
            <Image
              src="https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=500"
              alt="房间"
              width={500}
              height={375}
              className="rounded-3xl shadow-lg"
            />
          </div>
          <div className="feature-text">
            <span className="feature-label">02</span>
            <h3>虚拟房间</h3>
            <p>给猫猫一个家</p>
            <p>2D 布置家具，想怎么摆就怎么摆</p>
            <Link href="/room" className="btn btn-text">
              布置房间 <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA 区域 */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>还没找到你的猫？</h2>
          <p>随机一只带回家</p>
          <Link href="/adopt" className="btn btn-primary btn-large">
            <Sparkles size={20} />
            随机领养
          </Link>
        </div>
      </section>
    </div>
  )
}
