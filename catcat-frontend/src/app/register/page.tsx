'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Cat } from 'lucide-react'
import { useUser } from '@/context/UserContext'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useUser()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
        username,
        password,
        nickname: nickname || username,
        email: email || undefined,
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
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="auth-container">
        {/* Logo */}
        <div className="auth-logo">
          <Link href="/" className="flex items-center gap-2">
            <Cat size={32} className="text-caramel" />
            <span className="font-display text-2xl font-bold text-warmblack">CatCat</span>
          </Link>
        </div>

        {/* Form Card */}
        <div className="auth-card">
          <h1 className="auth-title">创建账户</h1>
          <p className="auth-subtitle">加入 CatCat 社区</p>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">用户名 <span className="required">*</span></label>
              <input
                type="text"
                id="username"
                className="form-input"
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="nickname" className="form-label">昵称</label>
              <input
                type="text"
                id="nickname"
                className="form-input"
                placeholder="请输入昵称（选填）"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">邮箱</label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="请输入邮箱（选填）"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">密码 <span className="required">*</span></label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="form-input"
                  placeholder="请输入密码（至少6位）"
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
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">确认密码 <span className="required">*</span></label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                className="form-input"
                placeholder="请再次输入密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="loading-spinner" />
              ) : (
                '注册'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              已有账户？
              <Link href="/login" className="auth-link">
                立即登录
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <Link href="/" className="back-home-link">
          ← 返回首页
        </Link>
      </div>

      <style jsx>{`
        .auth-container {
          width: 100%;
          max-width: 420px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .auth-logo {
          margin-bottom: 2rem;
        }

        .auth-card {
          width: 100%;
          background: var(--white);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 8px 40px var(--shadow);
        }

        .auth-title {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          text-align: center;
          margin-bottom: 0.5rem;
        }

        .auth-subtitle {
          font-family: var(--font-body);
          color: var(--text-secondary);
          text-align: center;
          margin-bottom: 2rem;
        }

        .auth-error {
          background: rgba(229, 115, 115, 0.1);
          color: #E57373;
          padding: 0.875rem 1rem;
          border-radius: 12px;
          font-family: var(--font-display);
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-family: var(--font-display);
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .required {
          color: #E57373;
        }

        .form-input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid var(--bg-tertiary);
          border-radius: 12px;
          font-family: var(--font-display);
          font-size: 0.9375rem;
          background: var(--bg-primary);
          transition: all 0.3s var(--ease-out-expo);
        }

        .form-input:focus {
          outline: none;
          border-color: var(--accent);
          background: var(--white);
        }

        .form-input::placeholder {
          color: var(--text-muted);
        }

        .password-input-wrapper {
          position: relative;
        }

        .password-input-wrapper .form-input {
          padding-right: 3rem;
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.25rem;
          transition: color 0.3s;
        }

        .password-toggle:hover {
          color: var(--accent);
        }

        .auth-submit-btn {
          width: 100%;
          padding: 1rem;
          background: var(--accent);
          color: var(--white);
          border: none;
          border-radius: 12px;
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s var(--ease-out-expo);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 0.5rem;
        }

        .auth-submit-btn:hover:not(:disabled) {
          background: var(--accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(200, 149, 108, 0.4);
        }

        .auth-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .auth-footer {
          margin-top: 2rem;
          text-align: center;
          font-family: var(--font-body);
          color: var(--text-secondary);
        }

        .auth-link {
          color: var(--accent);
          font-weight: 600;
          margin-left: 0.5rem;
          transition: color 0.3s;
        }

        .auth-link:hover {
          color: var(--accent-hover);
        }

        .back-home-link {
          margin-top: 2rem;
          color: var(--text-muted);
          font-family: var(--font-display);
          font-size: 0.875rem;
          transition: color 0.3s;
        }

        .back-home-link:hover {
          color: var(--accent);
        }
      `}</style>
    </div>
  )
}
