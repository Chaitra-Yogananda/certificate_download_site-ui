import React from 'react'

export function Button({ className = '', size, children, ...props }) {
  const base =
    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none'
  const sizes = {
    sm: 'h-8 px-3',
    md: 'h-10 px-4',
    lg: 'h-11 px-6'
  }
  const sizeClass = size ? (sizes[size] || '') : 'h-10 px-4'
  return (
    <button className={`${base} ${sizeClass} ${className}`} {...props}>
      {children}
    </button>
  )
}
