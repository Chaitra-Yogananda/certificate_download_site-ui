import { api } from './api'

export async function getCertificateBlob(courseCode, email) {
  if (!courseCode || !email) {
    throw new Error('Course code and email are required')
  }

  const url = `/api/certificate/download/${encodeURIComponent(courseCode)}`
  const response = await api.get(url, {
    params: { email },
    responseType: 'blob',
    validateStatus: (s) => s >= 200 && s < 500,
  })

  if (response.status >= 400) {
    let message = 'Failed to download certificate'
    try {
      const text = await response.data.text()
      const json = JSON.parse(text)
      if (json?.error) message = json.error
    } catch (_e) {
    }
    const err = new Error(message)
    err.status = response.status
    throw err
  }

  return response.data
}

export function triggerFileDownload(blob, filename) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
