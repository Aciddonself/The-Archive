import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const OAuthCallback = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { handleOAuthCallback } = useAuth()
  const [status, setStatus] = useState("Processing authentication...")
  const [error, setError] = useState(null)

  useEffect(() => {
    const processOAuthCallback = async () => {
      const code = searchParams.get("insforge_code")
      
      if (!code) {
        setError("No authorization code received")
        setStatus("Authentication failed")
        setTimeout(() => navigate("/login"), 3000)
        return
      }

      try {
        setStatus("Completing authentication...")
        const result = await handleOAuthCallback(code)
        
        if (result.success) {
          setStatus("Authentication successful! Redirecting...")
          setTimeout(() => navigate("/"), 1000)
        } else {
          setError(result.error || "Authentication failed")
          setStatus("Authentication failed")
          setTimeout(() => navigate("/login"), 3000)
        }
      } catch (err) {
        setError(err.message)
        setStatus("Authentication failed")
        setTimeout(() => navigate("/login"), 3000)
      }
    }

    processOAuthCallback()
  }, [searchParams, handleOAuthCallback, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-300 via-orange-300 to-blue-900">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
        {error ? (
          <>
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-red-600 mb-2">Authentication Failed</h2>
            <p className="text-gray-600">{error}</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-900 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-blue-900 mb-2">{status}</h2>
            <p className="text-gray-600">Please wait while we complete the sign-in process.</p>
          </>
        )}
      </div>
    </div>
  )
}

export default OAuthCallback
