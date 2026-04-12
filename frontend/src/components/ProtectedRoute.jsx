import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, isAdmin } = useAuth()
  const location = useLocation()

  // For admin routes, check if user is admin
  if (location.pathname.startsWith("/admin")) {
    if (!isAuthenticated || !isAdmin()) {
      return <Navigate to="/login" replace />
    }
    return children
  }

  // For regular routes that require authentication
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

// Public route - redirect to home if already authenticated (for login/register)
export const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}
