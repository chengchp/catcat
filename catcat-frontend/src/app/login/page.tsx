'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Cat } from 'lucide-react'
import { useUser } from '@/context/UserContext'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useUser()
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [forgotPwdMsg, setForgotPwdMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // 猫咪是否捂眼：密码框聚焦或有内容时捂眼
  const catCoveringEyes = passwordFocused || password.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(account, password)
      router.push('/')
    } catch (err) {
      setError('账号或密码错误')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = () => {
    setForgotPwdMsg('该功能正在开发中，敬请期待 🐾')
    setTimeout(() => setForgotPwdMsg(''), 3000)
  }

  return (
    <div className="login-page">
      {/* 左侧：猫猫摄影图（桌面端） */}
      <div className="login-hero">
        <img
          src="https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=1200"
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
          <p className="login-hero-desc">做一个快乐的铲屎官</p>
        </div>
      </div>

      {/* 右侧：登录表单 */}
      <div className="login-form-side">
        {/* 猫剪影 - 右下角 */}
        <div className="cat-silhouette">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M100 180C55 180 30 145 30 110C30 80 45 55 65 40L50 10L85 35C90 33 95 32 100 32C105 32 110 33 115 35L150 10L135 40C155 55 170 80 170 110C170 145 145 180 100 180Z"
              fill="currentColor"
              opacity="0.06"
            />
            <circle cx="75" cy="100" r="8" fill="currentColor" opacity="0.08" />
            <circle cx="125" cy="100" r="8" fill="currentColor" opacity="0.08" />
            <ellipse cx="100" cy="120" rx="6" ry="4" fill="currentColor" opacity="0.07" />
            <path d="M94 125Q100 132 106 125" stroke="currentColor" strokeWidth="2" opacity="0.07" fill="none" />
          </svg>
        </div>

        <div className="login-form-container">
          {/* 返回首页 */}
          <Link href="/" className="back-home-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            返回首页
          </Link>

          {/* 猫咪头像 + 捂眼动效 */}
          <div className="cat-avatar-wrapper">
            <div className={`cat-avatar ${catCoveringEyes ? 'covering' : ''}`}>
              <div className="cat-face">
                <Cat size={32} className="cat-face-icon" />
                {/* 猫爪 - 左 */}
                <div className="cat-paw cat-paw-left">🐾</div>
                {/* 猫爪 - 右 */}
                <div className="cat-paw cat-paw-right">🐾</div>
              </div>
            </div>
          </div>

          <h1 className="auth-title">好久不见，铲屎官</h1>
          <p className="auth-subtitle">登录你的 CatCat 账户</p>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="account" className="form-label">邮箱/用户名</label>
              <input
                type="text"
                id="account"
                className="form-input"
                placeholder="请输入邮箱或用户名"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">密码</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="form-input"
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  required
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
            </div>

            {/* 记住我 + 忘记密码 */}
            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>记住我</span>
              </label>
              <button type="button" className="forgot-pwd-link" onClick={handleForgotPassword}>
                忘记密码？
              </button>
            </div>

            {forgotPwdMsg && (
              <div className="forgot-pwd-toast">{forgotPwdMsg}</div>
            )}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="loading-paw">🐾</span>
              ) : (
                '登录'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              还没有账户？
              <Link href="/register" className="auth-link">
                立即注册
              </Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
