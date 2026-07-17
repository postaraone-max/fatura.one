export default function VerifyRequestPage() {
  return (
    <div style={{ maxWidth: 400, margin: '100px auto', textAlign: 'center' }}>
      <h2>?? Check your email</h2>
      <p>We sent you a magic link to sign in.</p>
      <p style={{ fontSize: 14, color: '#666' }}>
        Click the link in your email to continue.
      </p>
      <p style={{ fontSize: 12, color: '#999', marginTop: 20 }}>
        (For testing, check your terminal for the magic link URL)
      </p>
    </div>
  )
}

