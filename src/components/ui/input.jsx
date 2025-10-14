import React from 'react'

export function Input({ className = '', ...props }) {
  const base =
    'flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2'
  return <input className={`${base} ${className}`} {...props} />
}
