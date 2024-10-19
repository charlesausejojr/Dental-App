import React from 'react'

interface LoadingSpinnerProps {
  color?: string
}

export default function LoadingSpinner({ color = 'blue-500' }: LoadingSpinnerProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
      <div
        className={`w-16 h-16 border-4 border-t-${color} rounded-full animate-spin`}
        style={{ borderTopColor: `var(--${color})` }}
      ></div>
    </div>
  )
}