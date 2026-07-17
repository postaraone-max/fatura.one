'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages: Record<string, string> = {
    default: 'An error occurred during authentication.',
    configuration: 'There is a problem with the server configuration.',
    accessdenied: 'You do not have access to this resource.',
    verification: 'The magic link is invalid or has expired.',
  }

  const message = error ? errorMessages[error] || errorMessages.default : errorMessages.default

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', textAlign: 'center' }}>
      <h2 style={{ color: '#dc2626' }}>Authentication Error</h2>
      <p style={{ color: '#666' }}>{message}</p>
      <a href="/auth/signin" style={{ display: 'inline-block', marginTop: 20, color: '#0070f3' }}>
        Try again
      </a>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  )
}