'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Cat } from 'lucide-react'
import { useUser } from '@/context/UserContext'

const passwordStrengthLabels: Record<string, string> = {
  weak: '🐱 刚出生的小奶猫',
  medium: '🐈 精力充沛的短毛猫',
  strong: '🐆 肌肉发达的豹猫',
}

function getPasswordStrength(pwd: string): { level: string; percent: number } {
  if (!pwd) return { level: '', percent: 0 }
  let score = 0
  if (pwd.length >= 6) score++
  if (pwd.length >= 10) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++

  if (score <= 2) return { level: 'weak', percent: 33 }
  if (score <= 3) return { level: 'medium', percent: 66 }
  return { level: 'strong', percent: 100 }
}

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useUser()
  const [email, setEmail] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const passwordStrength = getPasswordStrength(password)
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    if (password.length < 6) {
      setError('密码长度至少6位')
      return
    }

    setLoading(true)

    try {
      await register({
        email,
        password,
        nickname,
      })
      router.push('/')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || '注册失败')
      } else {
        setError('注册失败')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page register-page">
      {/* 左侧英雄图（复用登录页样式） */}
      <div className="login-hero">
        <img
          src="https://chp-catcat.oss-ap-southeast-1.aliyuncs.com/breed/acur.jpg"
          alt=""
          className="login-hero-img"
        />
        <div className="login-hero-overlay" />
        <div className="login-hero-content">
          <div className="login-hero-brand">
            <span className="login-hero-logo">
              <Cat size={36} />
            </span>
            <h2 className="login-hero-title">CatCat</h2>
          </div>
          <p className="login-hero-desc">加入铲屎官的大家庭</p>
        </div>
      </div>

      {/* 右侧表单 */}
      <div className="login-form-side">
        <div className="login-form-container">
          {/* 返回首页 */}
          <Link href="/" className="back-home-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            返回首页
          </Link>

          {/* 猫头像 */}
          <div className="cat-avatar-wrapper">
            <div className="cat-avatar">
              <Cat size={32} className="cat-face-icon" />
            </div>
          </div>

          <h1 className="auth-title">欢迎加入猫窝</h1>
          <p className="auth-subtitle">创建你的 CatCat 账户</p>

          {error && (
            <div className="auth-error">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* 邮箱 */}
            <div className="form-group">
              <input
                type="email"
                className="form-input"
                placeholder="邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* 昵称 */}
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="昵称"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
              />
            </div>

            {/* 密码 */}
            <div className="form-group">
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="密码（至少6位）"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? '隐藏密码' : '显示密码'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* 密码强度 */}
              {password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div
                      className={`strength-fill strength-${passwordStrength.level}`}
                      style={{ width: `${passwordStrength.percent}%` }}
                    />
                  </div>
                  <span className="strength-label">
                    {passwordStrengthLabels[passwordStrength.level]}
                  </span>
                </div>
              )}
            </div>

            {/* 确认密码 */}
            <div className="form-group">
              <div className="confirm-password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input${passwordMismatch ? ' mismatch' : ''}`}
                  placeholder="再次输入密码"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
                {passwordMismatch && (
                  <span className="mismatch-icon" title="两次密码不一致">😿</span>
                )}
              </div>
              {passwordMismatch && (
                <span className="mismatch-hint">两次输入的密码不一致</span>
              )}
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="loading-paw">🐾</span>
              ) : (
                '加入社区'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              已有账户？
              <Link href="/login" className="auth-link">立即登录</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
