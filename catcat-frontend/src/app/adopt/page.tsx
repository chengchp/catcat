'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, RefreshCw, Home, Check } from 'lucide-react'
import { breedApi, catApi, type Breed, type Cat } from '@/lib/api'
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'

interface CatDNA {
  color: string
  pattern: string
  eyeColor: string
}

export default function AdoptPage() {
  const [breeds, setBreeds] = useState<Breed[]>([])
  const [loading, setLoading] = useState(false)
  const [adoptedCat, setAdoptedCat] = useState<Cat | null>(null)
  const [catDNA, setCatDNA] = useState<CatDNA | null>(null)
  const [catName, setCatName] = useState('')
  const [isRandomizing, setIsRandomizing] = useState(false)
  const [currentImage, setCurrentImage] = useState('')
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')

  const { isLoggedIn, isLoading: authLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push('/login')
      return
    }
    loadBreeds()
  }, [isLoggedIn, authLoading, router])

  const loadBreeds = async () => {
    try {
      const response = await breedApi.getAll()
      if (response.success) {
        setBreeds(response.data)
      }
    } catch (error) {
      console.error('Failed to load breeds:', error)
    }
  }

  const handleAdopt = async () => {
    if (breeds.length === 0) return

    setIsRandomizing(true)
    setAdoptedCat(null)
    setCatDNA(null)
    setCatName('')
    setStep(1)
    setError('')

    // 随机切换图片制造悬念
    let switchCount = 0
    const switchInterval = setInterval(() => {
      const randomBreed = breeds[Math.floor(Math.random() * breeds.length)]
      if (randomBreed.imageUrl) {
        setCurrentImage(randomBreed.imageUrl)
      }
      switchCount++
      if (switchCount >= 10) {
        clearInterval(switchInterval)
        finalizeAdopt()
      }
    }, 150)

    const finalizeAdopt = async () => {
      try {
        const response = await catApi.adopt()
        if (response.success) {
          const cat = response.data
          setAdoptedCat(cat)
          // 解析后端返回的DNA
          try {
            const dnaData = JSON.parse(cat.dna)
            setCatDNA(dnaData)
          } catch {
            setCatDNA({
              color: '未知',
              pattern: '未知',
              eyeColor: '未知',
            })
          }
          setCurrentImage(cat.imageUrl || '')
          setStep(2)
        }
      } catch (error) {
        console.error('Failed to adopt:', error)
        setError('领养失败，请重试')
      } finally {
        setIsRandomizing(false)
      }
    }
  }

  const handleConfirm = () => {
    setStep(3)
  }

  const handleReset = () => {
    setAdoptedCat(null)
    setCatDNA(null)
    setCatName('')
    setCurrentImage('')
    setStep(1)
    setError('')
  }

  return (
    <div className="adopt-page">
      {/* 步骤指示器 */}
      <div className="adopt-steps">
        <div className={`step ${step >= 1 ? (step > 1 ? 'done' : 'active') : ''}`}>
          <div className="step-num">{step > 1 ? <Check size={16} /> : '1'}</div>
          <div className="step-label">随机抽取</div>
        </div>
        <div className={`step ${step >= 2 ? (step > 2 ? 'done' : 'active') : ''}`}>
          <div className="step-num">{step > 2 ? <Check size={16} /> : '2'}</div>
          <div className="step-label">起名字</div>
        </div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-num">3</div>
          <div className="step-label">带回家</div>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="error-message">{error}</div>
      )}

      {/* 领养卡片 */}
      <div className="adopt-card">
        {/* 初始/抽卡状态 */}
        <div className={step === 1 ? '' : 'hidden'}>
          <div className="adopt-header">
            <h1>云领养</h1>
            <p>命运的齿轮开始转动...</p>
          </div>

          <div className="cat-display">
            {isRandomizing ? (
              <Image
                src={currentImage || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400'}
                alt="随机猫咪"
                width={180}
                height={180}
                className="cat-avatar randomizing"
              />
            ) : (
              <div className="cat-question-mark">?</div>
            )}
          </div>

          <p className="cat-info">
            {isRandomizing ? '命运抽签中...' : '点击下方按钮，随机领取一只猫'}
          </p>

          <div className="adopt-actions">
            <button
              onClick={handleAdopt}
              disabled={isRandomizing || breeds.length === 0}
              className="btn btn-primary w-full justify-center"
            >
              <Sparkles size={18} />
              开始领养
            </button>
          </div>
        </div>

        {/* 成功状态 - 起名字 */}
        <div className={step === 2 ? '' : 'hidden'}>
          <div className="adopt-header">
            <h1>恭喜！</h1>
            <p>你领养了一只猫</p>
          </div>

          <div className="cat-display">
            <Image
              src={adoptedCat?.imageUrl || currentImage || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400'}
              alt={adoptedCat?.name || '你的猫'}
              width={180}
              height={180}
              className="cat-avatar revealed"
            />
          </div>

          <h2 className="cat-name">{adoptedCat?.name || '小可爱'}</h2>
          <p className="cat-breed">{adoptedCat?.breedName}</p>

          {/* DNA 展示 */}
          <div className="cat-dna">
            <div className="dna-item">
              <div className="dna-label">毛色</div>
              <div className="dna-value">{catDNA?.color}</div>
            </div>
            <div className="dna-item">
              <div className="dna-label">花纹</div>
              <div className="dna-value">{catDNA?.pattern}</div>
            </div>
            <div className="dna-item">
              <div className="dna-label">眼睛</div>
              <div className="dna-value">{catDNA?.eyeColor}</div>
            </div>
          </div>

          {/* 名字输入 */}
          <div className="name-input-wrapper">
            <label htmlFor="nameInput">给它起个名字</label>
            <input
              type="text"
              id="nameInput"
              className="name-input"
              placeholder="输入名字..."
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
            />
          </div>

          <div className="adopt-actions">
            <button onClick={handleReset} className="btn btn-outline flex-1 justify-center">
              <RefreshCw size={18} />
              重新抽
            </button>
            <button onClick={handleConfirm} className="btn btn-primary flex-1 justify-center">
              <Home size={18} />
              带回家
            </button>
          </div>
        </div>

        {/* 完成状态 */}
        <div className={step === 3 ? '' : 'hidden'}>
          <div className="adopt-header">
            <div className="success-icon">
              <Check size={32} />
            </div>
            <h1>完成！</h1>
            <p>{catName || adoptedCat?.name} 已经成为你的猫了！</p>
          </div>

          <div className="cat-display">
            <Image
              src={adoptedCat?.imageUrl || currentImage || 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400'}
              alt={catName || adoptedCat?.name || '你的猫'}
              width={180}
              height={180}
              className="cat-avatar revealed"
            />
          </div>

          <div className="success-actions">
            <Link href="/my-cats" className="btn btn-outline flex-1 justify-center">
              <Home size={18} />
              我的猫咪
            </Link>
            <Link href="/room" className="btn btn-primary flex-1 justify-center">
              <Home size={18} />
              进入房间
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .adopt-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          background: radial-gradient(ellipse at top, var(--bg-secondary) 0%, transparent 50%), var(--bg-primary);
        }

        .hidden {
          display: none;
        }

        .error-message {
          background: #fee;
          color: #c33;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          margin-bottom: 1rem;
          font-family: var(--font-display);
          font-size: 0.875rem;
        }

        /* 步骤指示 */
        .adopt-steps {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .step {
          text-align: center;
          position: relative;
        }

        .step::after {
          content: '';
          position: absolute;
          top: 20px;
          right: -1.5rem;
          width: 1rem;
          height: 2px;
          background: var(--bg-tertiary);
        }

        .step:last-child::after {
          display: none;
        }

        .step-num {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--bg-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.5rem;
          font-family: var(--font-display);
          font-weight: 700;
          color: var(--text-muted);
        }

        .step.active .step-num {
          background: var(--accent);
          color: var(--white);
        }

        .step.done .step-num {
          background: var(--accent);
          color: var(--white);
        }

        .step-label {
          font-family: var(--font-display);
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .step.active .step-label,
        .step.done .step-label {
          color: var(--text-primary);
        }

        /* 领养卡片 */
        .adopt-card {
          background: var(--white);
          border-radius: 32px;
          padding: 3rem;
          box-shadow: 0 30px 80px var(--shadow-strong);
          text-align: center;
          max-width: 420px;
          width: 100%;
          position: relative;
          overflow: hidden;
        }

        .adopt-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(90deg, var(--accent), var(--accent-light), var(--accent));
        }

        .adopt-header {
          margin-bottom: 2rem;
        }

        .adopt-header h1 {
          font-family: var(--font-display);
          font-weight: 900;
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .adopt-header p {
          color: var(--text-secondary);
        }

        /* 猫猫展示区 */
        .cat-display {
          position: relative;
          margin: 2rem 0;
        }

        .cat-avatar {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          object-fit: cover;
          border: 6px solid var(--bg-secondary);
          box-shadow: 0 15px 40px var(--shadow);
          margin: 0 auto;
        }

        .cat-avatar.revealed {
          border-color: var(--accent);
          animation: bounce-in 0.6s var(--ease-out-back);
        }

        .cat-avatar.randomizing {
          animation: shake 0.5s infinite;
        }

        .cat-question-mark {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: var(--bg-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-weight: 900;
          font-size: 4rem;
          color: var(--text-muted);
          margin: 0 auto;
        }

        .cat-info {
          color: var(--text-muted);
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        /* DNA 信息 */
        .cat-dna {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin: 2rem 0;
        }

        .dna-item {
          background: var(--bg-secondary);
          padding: 0.75rem;
          border-radius: 12px;
        }

        .dna-label {
          font-family: var(--font-display);
          font-size: 0.625rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          margin-bottom: 0.25rem;
        }

        .dna-value {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.875rem;
          color: var(--text-primary);
        }

        /* 猫名字 */
        .cat-name {
          font-family: var(--font-display);
          font-weight: 900;
          font-size: 1.5rem;
          margin-bottom: 0.25rem;
        }

        .cat-breed {
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }

        /* 名字输入 */
        .name-input-wrapper {
          margin: 2rem 0;
          text-align: left;
        }

        .name-input-wrapper label {
          display: block;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }

        .name-input {
          width: 100%;
          padding: 1rem 1.25rem;
          border: 2px solid var(--bg-tertiary);
          border-radius: 16px;
          font-family: var(--font-display);
          font-size: 1rem;
          text-align: center;
          transition: all 0.3s var(--ease-out-expo);
        }

        .name-input:focus {
          outline: none;
          border-color: var(--accent);
        }

        /* 操作按钮 */
        .adopt-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .adopt-actions .btn {
          flex: 1;
          justify-content: center;
        }

        /* 成功状态 */
        .success-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--accent);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          animation: bounce-in 0.6s var(--ease-out-back);
        }

        .success-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .success-actions .btn {
          flex: 1;
          justify-content: center;
        }

        .flex-1 {
          flex: 1;
        }

        .justify-center {
          justify-content: center;
        }

        .w-full {
          width: 100%;
        }

        @keyframes bounce-in {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes shake {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
      `}</style>
    </div>
  )
}
