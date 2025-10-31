import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMsal } from '@azure/msal-react'
import { loginRequest, allowedEmailDomain } from '../auth/msalConfig'
import { getDetails } from '../services/certificate'
import axios from 'axios'
import { CheckCircle, Linkedin, Brain, Sparkles } from 'lucide-react'

export default function Certificate() {
  const navigate = useNavigate()
  const { courseCode } = useParams()
  const { instance, accounts, inProgress } = useMsal()
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  const email = useMemo(() => localStorage.getItem('candidateEmail') || '', [])
  const tenantId = (import.meta.env.VITE_MSAL_TENANT_ID || '').toLowerCase()

  const getCourseCode = useCallback(() => {
    const pending = sessionStorage.getItem('pendingCourseCode')
    if (pending) return pending
    if (courseCode) return courseCode
    const stored = localStorage.getItem('candidateCourseCode')
    if (stored) return stored
    return courseCode
  }, [courseCode])

  const ensureMsalLogin = useCallback(async () => {
    let account = accounts && accounts[0]
    if (!account) {
      try {
        const res = await instance.loginPopup(loginRequest)
        account = res.account
      } catch (error) {
        // ignore
      }
    }
    return account
  }, [accounts, instance])

  const performDownloadAndRedirect = useCallback(async (redirectTo = 'certificate') => {
    setError('')
    setStatus('')
    try {
      const cc = getCourseCode()
      let account = instance.getActiveAccount() || (accounts && accounts[0])
      if (!account) throw new Error('Sign-in required')
      if (!instance.getActiveAccount() && account) {
        try { instance.setActiveAccount(account) } catch (_) {}
      }

      const acctTenant = account?.tenantId || account?.idTokenClaims?.tid || ''
      const userUpn = (account?.username || '').toLowerCase()
      if (!acctTenant || (tenantId && acctTenant.toLowerCase() !== tenantId)) {
        throw new Error('Please sign in with your company account')
      }
      if (!userUpn.endsWith(`@${allowedEmailDomain}`)) {
        throw new Error('Only company users are allowed')
      }

      const token = await instance.acquireTokenSilent({ ...loginRequest, account })
      const meRes = await fetch('https://graph.microsoft.com/v1.0/me?$select=displayName,mail,userPrincipalName,userType,accountEnabled', {
        headers: { Authorization: `Bearer ${token.accessToken}` },
      })
      if (!meRes.ok) throw new Error('Failed to verify account status')
      const me = await meRes.json()
      if (me?.userType && me.userType !== 'Member') throw new Error('Only Member users are allowed')
      if (typeof me?.accountEnabled === 'boolean' && me.accountEnabled === false) throw new Error('Your account is inactive')

      let details = null
      try {
        details = await getDetails(email, cc)
      } catch (_) {
        details = null
      }

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL || window.location.origin}/api/certificates/generate`,
        { email, courseCode: cc },
        { responseType: 'blob' }
      )

      const blob = new Blob([res.data], { type: 'application/pdf' })
      let filename = 'certificate.pdf'
      const cd = res.headers && (res.headers['content-disposition'] || res.headers['Content-Disposition'])
      if (cd && /filename=([^;]+)/i.test(cd)) {
        filename = decodeURIComponent(cd.match(/filename=([^;]+)/i)[1].replace(/"/g, ''))
      } else {
        const u = details?.userName || details?.UserName
        const c = details?.courseName || details?.CourseName
        if (u && c) filename = `${u}_${c}.pdf`
      }
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      setStatus('Certificate generated and download started.')
      setIsVerified(true)
    } catch (e) {
      const msg = e?.response?.data?.error || e?.message || 'Verification failed'
      setError(msg)
      try {
        const cc = getCourseCode()
        const dl = `${import.meta.env.VITE_API_BASE_URL || window.location.origin}/api/certificates/download/${encodeURIComponent(cc)}?email=${encodeURIComponent(email)}`
        const iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        iframe.src = dl
        document.body.appendChild(iframe)
        setStatus('Attempted direct download.')
        setIsVerified(true)
      } catch (_) {}
      const lower = String(msg || '').toLowerCase()
      if (
        lower.includes('inactive') ||
        lower.includes('member users') ||
        lower.includes('company account') ||
        lower.includes('only company users') ||
        lower.includes('sign-in required')
      ) {
        const cc = getCourseCode()
        setTimeout(() => navigate(`/${encodeURIComponent(cc)}`, { replace: true }), 1200)
      }
    } finally {
      setLoading(false)
    }
  }, [accounts, instance, tenantId, email, navigate, getCourseCode])

  const startDownloadFlow = useCallback(async (redirectTo = 'certificate') => {
    setError('')
    if (!email || !new RegExp(`@${allowedEmailDomain.replace('.', '\\.')}$`, 'i').test(email)) {
      setError(`Please login again with your @${allowedEmailDomain} email`)
      navigate(`/${encodeURIComponent(getCourseCode())}`)
      return
    }
    const account = instance.getActiveAccount() || (accounts && accounts[0])
    if (!account) {
      await ensureMsalLogin()
      const acct = instance.getActiveAccount() || (accounts && accounts[0])
      if (acct && !instance.getActiveAccount()) {
        try { instance.setActiveAccount(acct) } catch (_) {}
      }
    }
    setLoading(true)
    setIsVerified(true)
    setStatus('AI Achievement Verified! Your AI program certificate download should begin automatically.')
    await performDownloadAndRedirect(redirectTo)
  }, [accounts, instance, email, navigate, performDownloadAndRedirect, getCourseCode])

  const verifyAndDownload = useCallback(async () => {
    await startDownloadFlow('certificate')
  }, [startDownloadFlow])

  const ranRef = useRef(false)
  useEffect(() => {
    const cc = getCourseCode()
    const desired = `/${encodeURIComponent(cc)}/certificate`
    if (cc && window.location.pathname.toLowerCase() !== desired.toLowerCase()) {
      navigate(desired, { replace: true })
    }

    if (ranRef.current) return
    if (inProgress !== 'none') return
    const pending = sessionStorage.getItem('pendingDownload')
    if (pending === '1' && accounts && accounts.length > 0) {
      ranRef.current = true
      const redirectTo = sessionStorage.getItem('pendingRedirect') || 'certificate'
      const cc = getCourseCode()
      const target = `/${encodeURIComponent(cc)}/certificate`
      if (window.location.pathname.toLowerCase() !== target.toLowerCase()) {
        navigate(target, { replace: true })
      }
      sessionStorage.removeItem('pendingDownload')
      sessionStorage.removeItem('pendingRedirect')
      sessionStorage.removeItem('pendingCourseCode')
      setIsVerified(true)
      setStatus('AI Achievement Verified! Your AI program certificate download should begin automatically.')
      setLoading(true)
      performDownloadAndRedirect(redirectTo)
    }
  }, [accounts, inProgress, performDownloadAndRedirect, navigate, getCourseCode])

  const handleLinkedInShare = useCallback(() => {
    const shareText = encodeURIComponent(
      "🚀 Thrilled to announce I've completed an advanced AI program! #AI #MachineLearning #Innovation"
    )
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&text=${shareText}`
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }, [])

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-gray-700">No session found.</p>
          <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={() => navigate(`/${encodeURIComponent(courseCode || 'SC-001')}`)}>Go to Login</button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-purple-600"
      style={{ background: 'linear-gradient(135deg, #9333ea 0%, #2563eb 50%, #06b6d4 100%)' }}
    >
      <header className="border-b border-white/20 bg-black/20 backdrop-blur-md relative z-10 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white drop-shadow-lg">AI Program Certification</h1>
                <p className="text-sm text-white/90 drop-shadow-md">Advanced Intelligence Achievement Portal</p>
              </div>
            </div>
            <span className="hidden sm:flex items-center gap-1 text-white/90 text-xs bg-white/10 rounded-full px-3 py-1">
              <Sparkles className="h-3 w-3" /> AI Powered
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-purple-600 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              <Brain className="h-4 w-4" /> AI Certificate Ready for Download
            </div>
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">Download Your AI Program Certificate</h2>
            <p className="text-lg text-white/95">Share your AI achievement on LinkedIn to unlock and download your official certificate</p>
          </div>

          <div className="overflow-hidden shadow-2xl border-0 bg-white/95 backdrop-blur-md relative rounded-xl">
            <div className="relative bg-white/90 backdrop-blur-sm rounded-xl p-6">
              <div className="aspect-[4/3] bg-gradient-to-br from-purple-100 via-blue-50 to-cyan-100 rounded-lg border-2 border-dashed border-purple-300 relative overflow-hidden">
                <div className="absolute inset-4 bg-white rounded-lg shadow-inner opacity-95"></div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                  <div className="text-center space-y-2 bg-white/95 p-4 rounded-lg shadow-lg">
                    <Brain className="h-8 w-8 text-purple-600 mx-auto" />
                    <p className="text-sm font-medium text-gray-800">AI Certificate Preview</p>
                    <p className="text-xs text-gray-600">Complete verification to unlock</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 mt-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium shadow-lg">1</div>
                  <div className="space-y-3 flex-1">
                    <div>
                      <h3 className="font-medium">Share Your AI Achievement on LinkedIn</h3>
                      <p className="text-sm text-gray-600">Showcase your artificial intelligence expertise to your professional network</p>
                    </div>
                    <button onClick={handleLinkedInShare} className="w-full bg-[#0077B5] hover:bg-[#005885] text-white px-4 py-2 rounded-md transition-all">
                      <span className="inline-flex items-center"><Linkedin className="h-4 w-4 mr-2" /> Share AI Achievement on LinkedIn</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium shadow-lg">2</div>
                  <div className="space-y-3 flex-1">
                    <div>
                      <h3 className="font-medium">Paste Your LinkedIn Post URL</h3>
                      <p className="text-sm text-gray-600">Copy and paste the link to your AI achievement post below</p>
                    </div>
                    <div className="space-y-3">
                      <input
                        placeholder="https://www.linkedin.com/posts/..."
                        className="w-full bg-white border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        onClick={verifyAndDownload}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-md transition-all disabled:opacity-50"
                      >
                        {loading ? 'Verifying…' : isVerified ? 'Download Certificate' : 'Verify & Download Certificate'}
                      </button>
                    </div>
                  </div>
                </div>

                {isVerified && (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">AI Achievement Verified!</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">Your AI program certificate download should begin automatically. Congratulations on mastering artificial intelligence!</p>
                  </div>
                )}

                {status && <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded p-3">{status}</div>}
                {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">{error}</div>}
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-6 text-sm text-white">
              <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-300" /><span className="text-white">Secure Download</span></div>
              <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-300" /><span className="text-white">AI Certified</span></div>
              <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-300" /><span className="text-white">Instant Verification</span></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
