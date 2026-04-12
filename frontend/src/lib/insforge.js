import { createClient } from "@insforge/sdk"

const INSFORGE_URL = import.meta.env.VITE_INSFORGE_URL || "https://envjj7hu.us-east.insforge.app"
const INSFORGE_API_KEY = import.meta.env.VITE_INSFORGE_API_KEY || ""

export const insforge = createClient({
  baseURL: INSFORGE_URL,
  apiKey: INSFORGE_API_KEY,
  auth: {
    persistSession: true,
    storageKey: "insforge_session"
  }
})

// Realtime chat instance
let realtimeInstance = null

export const getRealtimeChat = () => {
  if (!realtimeInstance) {
    realtimeInstance = createClient({
      baseURL: INSFORGE_URL,
      auth: {
        persistSession: true,
        storageKey: "insforge_session"
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })
  }
  return realtimeInstance
}

// Chat channel helpers
export const getUserChannel = (userId) => `chat:user:${userId}`
export const getAdminChannel = () => `chat:admin`
export const getConversationChannel = (conversationId) => `chat:conversation:${conversationId}`

// Online status channel
export const getOnlineStatusChannel = () => `presence:online`

export const signInWithGoogle = async () => {
  // Generate PKCE code verifier and challenge
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  
  // Store code verifier for later use
  sessionStorage.setItem("oauth_code_verifier", codeVerifier)
  
  // Build the OAuth URL
  const redirectUri = `${window.location.origin}/oauth/callback`
  const authUrl = `${INSFORGE_URL}/api/auth/oauth/google?redirect_uri=${encodeURIComponent(redirectUri)}&code_challenge=${codeChallenge}`
  
  // Open OAuth in popup or redirect
  window.location.href = authUrl
}

export const signInWithApple = async () => {
  // Generate PKCE code verifier and challenge
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  
  // Store code verifier for later use
  sessionStorage.setItem("oauth_code_verifier", codeVerifier)
  
  // Build the OAuth URL
  const redirectUri = `${window.location.origin}/oauth/callback`
  const authUrl = `${INSFORGE_URL}/api/auth/oauth/apple?redirect_uri=${encodeURIComponent(redirectUri)}&code_challenge=${codeChallenge}`
  
  // Open OAuth in popup or redirect
  window.location.href = authUrl
}

export const exchangeOAuthCode = async (code) => {
  const codeVerifier = sessionStorage.getItem("oauth_code_verifier")
  if (!codeVerifier) {
    throw new Error("Code verifier not found")
  }
  
  const response = await fetch(`${INSFORGE_URL}/api/auth/oauth/exchange`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      code,
      code_verifier: codeVerifier
    })
  })
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to exchange code")
  }
  
  // Clean up
  sessionStorage.removeItem("oauth_code_verifier")
  
  return response.json()
}

// PKCE helper functions
function generateCodeVerifier() {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return base64UrlEncode(array)
}

async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const digest = await crypto.subtle.digest("SHA-256", data)
  return base64UrlEncode(new Uint8Array(digest))
}

function base64UrlEncode(array) {
  return btoa(String.fromCharCode.apply(null, array))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
}

export default insforge
