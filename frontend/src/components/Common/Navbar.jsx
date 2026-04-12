import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { FaUser, FaShoppingBag, FaBars, FaSignOutAlt, FaCog, FaComment, FaChevronDown, FaChevronRight, FaHeart } from "react-icons/fa"
import SearchBar from "./SearchBar"
import CartDrawer from "../Layout/CartDrawer"
import { useCart } from "../../context/CartContext"
import { useWishlist } from "../../context/WishlistContext"
import { useAuth } from "../../context/AuthContext"
import man1 from "../../assets/man1.webp"

// Dropdown configuration - Simplified: Men, Women, Kids, Unisex
const navLinks = [
  { name: "Men", path: "/men" },
  { name: "Women", path: "/women" },
  { name: "Kids", path: "/kids" },
  { name: "Unisex", path: "/unisex" }
]

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAdmin } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [openDropdowns, setOpenDropdowns] = useState({})
  const [imageError, setImageError] = useState(false)
  
  // Track scroll position for navbar background change
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  
  // Use CartContext for cart management
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal, cartCount } = useCart()
  const { itemCount: wishlistCount } = useWishlist()
  
  // Check login status on mount and when events are triggered
  useEffect(() => {
    const checkLoginStatus = () => {
      // Check both isLoggedIn and currentUser for compatibility
      const loggedIn = localStorage.getItem("isLoggedIn") === "true" || localStorage.getItem("currentUser") !== null
      const userData = localStorage.getItem("currentUser")
      setIsLoggedIn(loggedIn)
      if (userData) {
        setUser(JSON.parse(userData))
      }
    }

    checkLoginStatus()

    // Listen for login/logout events
    window.addEventListener("userLoggedIn", checkLoginStatus)
    window.addEventListener("userLoggedOut", checkLoginStatus)
    window.addEventListener("profileUpdated", checkLoginStatus)

    return () => {
      window.removeEventListener("userLoggedIn", checkLoginStatus)
      window.removeEventListener("userLoggedOut", checkLoginStatus)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("currentUser")
    localStorage.setItem("isLoggedIn", "false")
    setIsLoggedIn(false)
    setUser(null)
    setIsProfileOpen(false)
    window.dispatchEvent(new Event("userLoggedOut"))
    // Redirect to login page
    navigate("/login")
  }

  // Use CartContext for cart management

  // Listen for cart updates from other components
  useEffect(() => {
    const handleCartUpdate = () => {
      // Cart context will auto-update, just force re-render if needed
    }
    window.addEventListener("cartUpdated", handleCartUpdate)
    return () => window.removeEventListener("cartUpdated", handleCartUpdate)
  }, [])

  // Helper function to determine if a nav link is active
  const isActive = (path) => {
    if (path === "/" || path === "") {
      return location.pathname === "/"
    }
    return location.pathname.startsWith(path)
  }

  // Nav link class helper
  const getNavLinkClass = (path) => {
    const baseClass = "text-sm font-medium uppercase transition-colors duration-200"
    if (isActive(path)) {
      return `${baseClass} text-red-400 underline underline-offset-4`
    }
    return `${baseClass} text-white hover:text-red-300 hover:underline hover:underline-offset-4`
  }

  // Toggle dropdown
  const toggleDropdown = (name) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [name]: !prev[name]
    }))
  }

  // Close all dropdowns
  const closeAllDropdowns = () => {
    setOpenDropdowns({})
  }

  // Handle profile image error
  const handleImageError = (e) => {
    e.target.src = man1
    setImageError(true)
  }

  const handleUpdateQuantity = (productId, newQuantity) => {
    // Find the item to get size and color
    const item = cartItems.find(item => item.productId === productId)
    if (!item) return
    updateQuantity(productId, item.size, item.color, newQuantity)
  }

  const handleRemove = (productId) => {
    const item = cartItems.find(item => item.productId === productId)
    if (!item) return
    removeFromCart(productId, item.size, item.color)
  }

  const handleCheckout = () => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true" || localStorage.getItem("currentUser") !== null
    const userData = localStorage.getItem("currentUser")
    
    if (!isLoggedIn) {
      setIsCartOpen(false)
      // Redirect to login page
      navigate("/login")
      return
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty!")
      return
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    
    // Log checkout details to console
    console.log("=== CHECKOUT INITIATED ===")
    console.log("Customer Details:", JSON.parse(userData || "{}"))
    console.log("Order Summary:")
    console.log("- Number of Items:", itemCount)
    console.log("- Products:", cartItems.map(item => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      subtotal: item.price * item.quantity
    })))
    console.log("- Subtotal: $", subtotal.toFixed(2))
    console.log("- Shipping: $", "5.00")
    console.log("- Total: $", (subtotal + 5).toFixed(2))
    console.log("Order Date:", new Date().toISOString())
    console.log("==========================")
    
    // Store cart in localStorage for checkout page
    localStorage.setItem("checkoutCart", JSON.stringify(cartItems))
    
    // Close cart and navigate to checkout
    setIsCartOpen(false)
    navigate("/checkout")
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between w-full px-6 py-4 transition-all duration-300 bg-gray-900">
        {/* Left - Logo */}
        <div className="z-50 flex-shrink-0">
            <Link to="/" className="text-2xl font-medium text-white">Aromomit-Fashions</Link>
        </div>

        {/* Center - Navigation Links (Desktop) */}
        <div className="absolute hidden space-x-6 transform -translate-x-1/2 md:flex left-1/2">
            <Link to="/" className={getNavLinkClass("/")}>
                Home
            </Link>
            <Link to="/shop" className={getNavLinkClass("/shop")}>
                Shop
            </Link>
            {navLinks.map((link) => (
                <Link
                    key={link.name}
                    to={link.path}
                    className={getNavLinkClass(link.path)}
                >
                    {link.name}
                </Link>
            ))}
        </div>

        {/* Right - Icons */}
        <div className="z-50 flex items-center space-x-4">
            {/* Profile Icon */}
            <div className="relative">
                {isLoggedIn ? (
                    <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-2 text-white hover:text-gray-300"
                    >
                        <img 
                            src={!imageError ? (user?.avatar || man1) : man1} 
                            alt="Profile" 
                            className="object-cover w-8 h-8 border-2 border-white rounded-full"
                            onError={handleImageError}
                        />
                    </button>
                ) : (
                    <Link to="/login" className="text-white hover:text-gray-300">
                        <FaUser className="w-5 h-5" />
                    </Link>
                )}

                {/* Profile Dropdown */}
                {isProfileOpen && isLoggedIn && (
                    <div className="absolute right-0 w-64 py-2 mt-2 bg-white rounded-lg shadow-lg">
                        <div className="px-4 py-2 border-b">
                            <p className="font-semibold text-gray-900">{user?.name}</p>
                            <p className="text-sm text-gray-600">{user?.email}</p>
                            {user?.role === "main_admin" && (
                                <span className="inline-block px-2 py-0.5 mt-1 text-xs font-semibold text-white bg-red-600 rounded">Admin</span>
                            )}
                            {user?.role === "sub_admin" && (
                                <span className="inline-block px-2 py-0.5 mt-1 text-xs font-semibold text-white bg-blue-600 rounded">Sub-Admin</span>
                            )}
                        </div>
                        {(user?.role === "main_admin" || user?.role === "sub_admin") && (
                            <Link 
                                to="/admin" 
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                                onClick={() => setIsProfileOpen(false)}
                            >
                                <FaCog />
                                Admin Panel
                            </Link>
                        )}
                        <Link 
                            to="/profile" 
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileOpen(false)}
                        >
                            My Profile
                        </Link>
                        <Link 
                            to="/profile" 
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileOpen(false)}
                        >
                            My Orders
                        </Link>
                        <Link 
                            to="/chat" 
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileOpen(false)}
                        >
                            <FaComment />
                            Chat with Support
                        </Link>
                        <button 
                            onClick={handleLogout}
                            className="flex items-center w-full gap-2 px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                        >
                            <FaSignOutAlt />
                            Logout
                        </button>
                    </div>
                )}
            </div>

            <div className="relative">
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="text-white hover:text-gray-300"
                >
                    <FaShoppingBag className="w-5 h-5" />
                </button>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {cartCount}
                  </span>
                )}
            </div>
            <Link to="/wishlist" className="relative text-white hover:text-gray-300">
                <FaHeart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-pink-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {wishlistCount}
                  </span>
                )}
            </Link>
            <div className="text-white">
                <SearchBar color="white" />
            </div>
            {/* Mobile Menu Button */}
            <button 
                className="text-white md:hidden hover:text-gray-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                <FaBars className="w-5 h-5" />
            </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
            <div className="absolute left-0 right-0 z-40 px-6 py-4 bg-gray-900 shadow-lg md:hidden top-full">
                <div className="flex flex-col space-y-2">
                    <Link to="/" className={getNavLinkClass("/")} onClick={() => setIsMenuOpen(false)}>
                        Home
                    </Link>
                    <Link to="/shop" className={getNavLinkClass("/shop")} onClick={() => setIsMenuOpen(false)}>
                        Shop
                    </Link>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={getNavLinkClass(link.path)}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            </div>
        )}

        {/* Cart Drawer */}
        <CartDrawer 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemove={handleRemove}
          onCheckout={handleCheckout}
        />
    </nav>
  )
}

export default Navbar
