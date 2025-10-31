import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Certificate from './pages/Certificate'

export default function App() {
  function StartRoute() {
    const pending = typeof window !== 'undefined' && window.sessionStorage.getItem('pendingDownload') === '1'
    const storedCourse = (typeof window !== 'undefined' && (window.sessionStorage.getItem('pendingCourseCode') || window.localStorage.getItem('candidateCourseCode'))) || 'SC-001'
    const hasEmail = typeof window !== 'undefined' && !!window.localStorage.getItem('candidateEmail')
    const target = (pending || hasEmail) ? `/${encodeURIComponent(storedCourse)}/certificate` : `/${encodeURIComponent(storedCourse)}`
    return <Navigate to={target} replace />
  }

  return (
    <Routes>
      <Route path=":courseCode" element={<Login />} />
      <Route path=":courseCode/certificate" element={<Certificate />} />
      <Route path="*" element={<StartRoute />} />
    </Routes>
  )
}
