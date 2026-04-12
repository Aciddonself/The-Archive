import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

// Helper to get user-specific cart key
const getUserCartKey = (userId) => `cartItems_${userId}`

// Helper to get stored user ID
const getStoredUserId = () => {
  const user = localStorage.getItem("currentUser")
  if (user) {
    const userData = JSON.parse(user)
    return userData.id
  }
  return null
}

export const CartProvider = ({ children }) => {
  // Get current user ID
  const userId = getStoredUserId()
  const cartKey = userId ? getUserCartKey(userId) : "cartItems"
  
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem(cartKey)
    return savedCart ? JSON.parse(savedCart) : []
  })

  const [currentUserId, setCurrentUserId] = useState(userId)

  // Listen for user login/logout events to switch cart storage
  useEffect(() => {
    const handleUserChange = () => {
      const newUserId = getStoredUserId()
      if (newUserId !== currentUserId) {
        // Save current cart to old user's storage
        if (currentUserId) {
          localStorage.setItem(getUserCartKey(currentUserId), JSON.stringify(cartItems))
        }
        
        setCurrentUserId(newUserId)
        
        // Load cart from new user's storage
        const newCartKey = newUserId ? getUserCartKey(newUserId) : "cartItems"
        const savedCart = localStorage.getItem(newCartKey)
        setCartItems(savedCart ? JSON.parse(savedCart) : [])
      }
    }

    // Handle cart clear event from checkout
    const handleCartClear = () => {
      setCartItems([])
    }

    window.addEventListener("userLoggedIn", handleUserChange)
    window.addEventListener("userLoggedOut", handleUserChange)
    window.addEventListener("cartCleared", handleCartClear)
    
    return () => {
      window.removeEventListener("userLoggedIn", handleUserChange)
      window.removeEventListener("userLoggedOut", handleUserChange)
      window.removeEventListener("cartCleared", handleCartClear)
    }
  }, [currentUserId, cartItems])

  // Save cart to localStorage when it changes
  useEffect(() => {
    const userId = getStoredUserId()
    const cartKey = userId ? getUserCartKey(userId) : "cartItems"
    localStorage.setItem(cartKey, JSON.stringify(cartItems))
    // Dispatch event for Navbar to update
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: cartItems }))
  }, [cartItems])

  const addToCart = (product, size = "M", color = "Default") => {
    const newItem = {
      productId: product.productId || Date.now(),
      name: product.name,
      price: product.price,
      quantity: 1,
      size: size,
      color: color,
      image: product.image || product.images?.[0]?.url
    }

    setCartItems(prevItems => {
      // Check if item already exists
      const existingItem = prevItems.find(
        item => item.productId === newItem.productId && item.size === size && item.color === color
      )

      if (existingItem) {
        return prevItems.map(item =>
          item.productId === newItem.productId && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...prevItems, newItem]
    })
  }

  const removeFromCart = (productId, size, color) => {
    setCartItems(prevItems =>
      prevItems.filter(
        item => !(item.productId === productId && item.size === size && item.color === color)
      )
    )
  }

  const updateQuantity = (productId, size, color, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId, size, color)
      return
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId && item.size === size && item.color === color
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
