import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"
import { wishlistService } from "../lib/database"

const WishlistContext = createContext(null)

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth()
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      loadWishlist()
    } else {
      // Load from localStorage for guest users
      const stored = JSON.parse(localStorage.getItem("guest_wishlist") || "[]")
      setWishlist(stored)
      setLoading(false)
    }
  }, [user?.id])

  const loadWishlist = async () => {
    try {
      const { data, error } = await wishlistService.getByUserId(user.id)
      if (!error && data) {
        setWishlist(data)
      }
    } catch (error) {
      console.error("Error loading wishlist:", error)
    }
    setLoading(false)
  }

  const addToWishlist = async (product) => {
    if (!product || !product.id) return
    
    if (user?.id) {
      try {
        const { data, error } = await wishlistService.add(user.id, product.id)
        if (!error && data) {
          setWishlist(prev => [...prev, { ...product, wishlist_id: data.id }])
          return { success: true }
        }
      } catch (error) {
        console.error("Error adding to wishlist:", error)
        return { success: false, error: error.message }
      }
    } else {
      // Guest user - store in localStorage
      const stored = JSON.parse(localStorage.getItem("guest_wishlist") || "[]")
      if (!stored.find(p => p.id === product.id)) {
        stored.push(product)
        localStorage.setItem("guest_wishlist", JSON.stringify(stored))
        setWishlist(stored)
      }
      return { success: true }
    }
  }

  const removeFromWishlist = async (productId) => {
    if (user?.id) {
      try {
        const { error } = await wishlistService.remove(user.id, productId)
        if (!error) {
          setWishlist(prev => prev.filter(p => p.id !== productId))
          return { success: true }
        }
      } catch (error) {
        console.error("Error removing from wishlist:", error)
        return { success: false, error: error.message }
      }
    } else {
      // Guest user - remove from localStorage
      const stored = JSON.parse(localStorage.getItem("guest_wishlist") || "[]")
      const filtered = stored.filter(p => p.id !== productId)
      localStorage.setItem("guest_wishlist", JSON.stringify(filtered))
      setWishlist(filtered)
      return { success: true }
    }
  }

  const isInWishlist = (productId) => {
    return wishlist.some(p => p.id === productId)
  }

  const clearWishlist = () => {
    if (user?.id) {
      // This would require deleting all wishlist items
      setWishlist([])
    } else {
      localStorage.removeItem("guest_wishlist")
      setWishlist([])
    }
  }

  const value = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    itemCount: wishlist.length
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}

export default WishlistContext
