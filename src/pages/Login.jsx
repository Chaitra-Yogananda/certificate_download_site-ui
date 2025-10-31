import React, { useMemo, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { validateUser } from '../services/certificate'
import { allowedEmailDomain } from '../auth/msalConfig'
import { useMsal } from '@azure/msal-react'

export default function Login() {
  const navigate = useNavigate()
  const { courseCode } = useParams()
  const { accounts, inProgress } = useMsal()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const emailOk = useMemo(() => new RegExp(`@${allowedEmailDomain.replace('.', '\\.')}$`, 'i').test(email.trim()), [email])

  useEffect(() => {
    const pending = sessionStorage.getItem('pendingDownload')
    const hasEmail = !!localStorage.getItem('candidateEmail')
    const msalReady = inProgress === 'none' && accounts && accounts.length > 0
    if (courseCode && (pending === '1' || hasEmail || msalReady)) {
      navigate(`/${encodeURIComponent(courseCode)}/certificate`, { replace: true })
    }
  }, [courseCode, navigate, accounts, inProgress])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const clean = email.trim().toLowerCase()
    if (!clean || !emailOk) {
      setError(`Please use your @${allowedEmailDomain} email`)
      return
    }
    if (!courseCode) {
      setError('Invalid course URL')
      return
    }
    try {
      setLoading(true)
      const res = await validateUser(clean, courseCode)
      if (res?.valid) {
        localStorage.setItem('candidateEmail', clean)
        localStorage.setItem('candidateCourseCode', courseCode)
        navigate(`/${encodeURIComponent(courseCode)}/certificate`, { replace: true })
      } else {
        setError('You are not eligible to download the Certificate.')
      }
    } catch (err) {
      setError('Server error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #9333ea 0%, #2563eb 50%, #06b6d4 100%)' }}>
      <div className="w-full max-w-md bg-white/95 backdrop-blur rounded-xl shadow-2xl border">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-center mb-2">Certificate Site</h1>
          <p className="text-sm text-center text-gray-600 mb-6">Enter your corporate email to continue</p>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Corporate Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={`name@${allowedEmailDomain}`}
                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {error ? (
              <div className="text-sm text-red-600">{error}</div>
            ) : (
              <div className="text-xs text-gray-500">Only {allowedEmailDomain} emails are allowed</div>
            )}
            <button
              type="submit"
              disabled={!emailOk || loading}
              className="w-full rounded-md bg-blue-600 text-white py-2.5 font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Submit'}
            </button>
          </form>
        </div>
        <div className="px-6 py-3 bg-gray-50 text-xs text-gray-600 rounded-b-xl">
          Course: <span className="font-medium">{courseCode || '-'}</span>
        </div>
      </div>
    </div>
  )
}
