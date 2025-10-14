import React from 'react'

export function Badge({ variant = 'default', className = '', children, ...props }) {
  const base =
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors'
  const variants = {
    default: 'bg-primary text-primary-foreground border-transparent',
    secondary: 'bg-secondary text-secondary-foreground border-transparent',
    outline: 'text-foreground'
  }
  const v = variants[variant] || variants.default
  return (
    <span className={`${base} ${v} ${className}`} {...props}>
      {children}
    </span>
  )
}
