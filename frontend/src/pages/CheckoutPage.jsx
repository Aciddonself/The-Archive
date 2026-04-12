import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { FaLock, FaCreditCard, FaTrash, FaCheck, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa"
import { loadStripe } from "@stripe/stripe-js"
import { ordersService, promoCodesService } from "../lib/database"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"

// Initialize Stripe with publishable key
const stripePromise = loadStripe("pk_test_51T2tZ3HGvgZxwRzvjFNwExojNMhYUuewNKdShNK5d6hfXhX64q5ZzZ2QBIbtfOvnruPEm4x5YR4Q50RaIWzHY6Oa00VxqwTIzq")

// API Base URL - Change this to your backend URL in production
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

// Payment Form Component (wrapped in Elements provider)
const PaymentForm = ({ clientSecret, orderTotal, onSuccess, onError, onBack }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardError, setCardError] = useState("")
  const [cardComplete, setCardComplete] = useState(false)

  // Check if using mock payment (offline mode)
  const isMockPayment = clientSecret && clientSecret.startsWith("pi_mock_")
  
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    // Handle mock payment (offline mode)
    if (isMockPayment) {
      setIsProcessing(true)
      // Simulate payment success
      setTimeout(() => {
        const mockPaymentIntent = {
          id: clientSecret.replace("_secret_", "_pi_"),
          status: "succeeded",
          amount: orderTotal * 100
        }
        setIsProcessing(false)
        onSuccess(mockPaymentIntent)
      }, 1500)
      return
    }

    setIsProcessing(true)
    setCardError("")

    const cardElement = elements.getElement(CardElement)

    // Confirm payment with Stripe
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      }
    })

    if (error) {
      setCardError(error.message)
      setIsProcessing(false)
      onError(error.message)
    } else if (paymentIntent.status === "succeeded") {
      setIsProcessing(false)
      onSuccess(paymentIntent)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      },
      invalid: {
        color: "#9e2146",
      },
    },
    hidePostalCode: false,
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-4 mb-6 rounded-lg bg-gray-50">
        <h3 className="mb-2 font-medium">Order Total</h3>
        <p className="text-2xl font-bold text-red-600">${orderTotal.toFixed(2)}</p>
      </div>

      {/* Stripe Card Element */}
      <div className="p-6 mb-6 border border-gray-200 rounded-lg">
        {isMockPayment && (
          <div className="p-3 mb-4 text-sm text-yellow-800 bg-yellow-50 rounded-lg">
            <strong>Demo Mode:</strong> Backend is offline. Payment will be simulated.
          </div>
        )}
        <div className="flex items-center justify-between mb-4">
          <p className="flex items-center text-gray-600">
            <FaLock className="mr-2 text-green-600" />
            Pay securely with Stripe
          </p>
          <div className="flex gap-2">
            <span className="text-xs text-gray-400">Visa</span>
            <span className="text-xs text-gray-400">Mastercard</span>
            <span className="text-xs text-gray-400">Amex</span>
            <span className="text-xs text-gray-400">Discover</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Card Details
            </label>
            {isMockPayment ? (
              <div className="p-4 bg-gray-50 border border-gray-300 rounded-lg text-center text-gray-600">
                <p className="text-sm">Demo Mode - No real card needed</p>
                <p className="text-xs text-gray-400 mt-1">Payment will be simulated</p>
              </div>
            ) : (
              <div className="p-4 bg-white border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-red-500 focus-within:border-transparent">
                <CardElement 
                  options={cardElementOptions} 
                  onChange={(e) => {
                    setCardComplete(e.complete)
                    setCardError(e.error ? e.error.message : "")
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {cardError && (
          <p className="mt-2 text-sm text-red-500">{cardError}</p>
        )}
      </div>

      {/* Security Note */}
      <div className="flex items-center justify-center gap-2 mb-4 text-sm text-gray-500">
        <FaLock />
        <span>Your payment information is encrypted and secure</span>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isProcessing}
          className="flex-1 py-3 font-semibold text-gray-700 transition-colors bg-gray-200 rounded-lg hover:bg-gray-300 disabled:bg-gray-100"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isMockPayment ? isProcessing : (!stripe || !cardComplete || isProcessing)}
          className="flex items-center justify-center flex-1 gap-2 py-3 font-semibold text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-gray-400"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
              Processing...
            </>
          ) : (
            <>
              <FaLock />
              {isMockPayment ? "Simulate Payment" : `Pay ${orderTotal.toFixed(2)}`}
            </>
          )}
        </button>
      </div>
    </form>
  )
}

// Main Checkout Page
const CheckoutPage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: Contact Details, 2: Payment
  const [isProcessing, setIsProcessing] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [orderTotal, setOrderTotal] = useState(0)
  const [clientSecret, setClientSecret] = useState("")
  const [checkoutId, setCheckoutId] = useState("")
  const [paymentError, setPaymentError] = useState("")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showProductDetails, setShowProductDetails] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Texas",
    postalCode: ""
  })

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem("currentUser") || localStorage.getItem("user")
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
      
      if (!userData || !isLoggedIn) {
        setShowLoginPrompt(true)
      } else {
        setIsAuthenticated(true)
        // Pre-fill form with user data
        const user = JSON.parse(userData)
        if (user) {
          setFormData(prev => ({
            ...prev,
            firstName: user.name ? user.name.split(' ')[0] : '',
            lastName: user.name ? user.name.split(' ').slice(1).join(' ') : '',
            email: user.email || '',
            phone: user.phone || ''
          }))
        }
      }
    }
    
    checkAuth()
  }, [])

  const handleRemoveItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.productId !== productId)
    setCartItems(updatedCart)
    
    // Update localStorage
    localStorage.setItem("checkoutCart", JSON.stringify(updatedCart))
    
    // Update total
    const newTotal = updatedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 5
    setOrderTotal(newTotal)
    
    // Close product details if open
    if (selectedProduct?.productId === productId) {
      setSelectedProduct(null)
      setShowProductDetails(false)
    }
  }

  const handleProductClick = (item) => {
    if (selectedProduct?.productId === item.productId) {
      setShowProductDetails(!showProductDetails)
    } else {
      setSelectedProduct(item)
      setShowProductDetails(true)
    }
  }

  useEffect(() => {
    const savedCart = localStorage.getItem("checkoutCart")
    if (savedCart) {
      const items = JSON.parse(savedCart)
      setCartItems(items)
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      setOrderTotal(total + 5) // Add shipping
    } else {
      navigate("/shop")
    }
  }, [navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Create checkout entry to backend
  const createCheckoutEntry = async (contactDetails, cart) => {
    console.log("=== CREATING CHECKOUT ENTRY ===")
    console.log("Sending request to backend...")
    console.log("Endpoint: POST " + API_BASE_URL + "/api/checkout/create")
    
    try {
      const response = await fetch(API_BASE_URL + "/api/checkout/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customer: contactDetails,
          items: cart,
          subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          shipping: 5,
          total: orderTotal,
          currency: "USD"
        })
      })
      
      const data = await response.json()
      
      console.log("Backend Response:", data)
      console.log("================================")
      
      return data
    } catch (error) {
      console.error("Error creating checkout:", error)
      
      // Fallback: Create mock checkout data for demo/testing
      console.log("Using fallback mock checkout...")
      const mockClientSecret = "pi_mock_" + Date.now() + "_secret_" + Math.random().toString(36).substr(2, 9)
      
      // Store order in localStorage for admin panel
      const orderId = "ORD-" + Date.now() + "-" + Math.random().toString(36).substr(2, 6).toUpperCase()
      const orders = JSON.parse(localStorage.getItem("orders") || "[]")
      orders.push({
        id: orderId,
        customer: contactDetails,
        items: cart,
        subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        shipping: 5,
        total: orderTotal,
        currency: "USD",
        status: "pending_payment",
        paymentStatus: "pending",
        createdAt: new Date().toISOString()
      })
      localStorage.setItem("orders", JSON.stringify(orders))
      
      return {
        success: true,
        checkoutId: orderId,
        clientSecret: mockClientSecret,
        paymentIntentId: "pi_mock_" + Date.now(),
        status: "pending_payment"
      }
    }
  }

  const handleSubmitContact = async (e) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.phone || !formData.address || !formData.city) {
      alert("Please fill in all required fields")
      return
    }

    setIsProcessing(true)

    try {
      // Create checkout entry
      const checkoutData = await createCheckoutEntry(formData, cartItems)
      
      if (checkoutData.success && checkoutData.clientSecret) {
        // Store checkout data for payment
        localStorage.setItem("checkoutData", JSON.stringify({
          checkoutId: checkoutData.checkoutId,
          clientSecret: checkoutData.clientSecret,
          customer: formData,
          items: cartItems,
          total: orderTotal
        }))
        
        setClientSecret(checkoutData.clientSecret)
        setCheckoutId(checkoutData.checkoutId)
        setIsProcessing(false)
        setStep(2) // Move to payment step
      } else {
      throw new Error(checkoutData.error || "Failed to create checkout")
    }
    } catch (error) {
      console.error("Error creating checkout:", error)
      console.error("Error response:", error.response)
      alert("Failed to create checkout: " + (error.message || "Please try again."))
      setIsProcessing(false)
    }
  }

  const handlePaymentSuccess = async (paymentIntent) => {
    console.log("=== PAYMENT SUCCEEDED ===")
    console.log("Payment Intent ID:", paymentIntent.id)
    console.log("Amount:", paymentIntent.amount / 100)
    console.log("=========================")
    
    // Check if this is a mock payment (offline mode)
    const isMockPayment = paymentIntent.id && paymentIntent.id.startsWith("pi_mock_")
    
    // Get user data for saving order
    const userData = localStorage.getItem("user") || localStorage.getItem("currentUser")
    const user = userData ? JSON.parse(userData) : null
    
    // Create order object
    const order = {
      id: checkoutId || `ORD-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: isMockPayment ? "completed" : "Processing",
      total: orderTotal,
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color,
        image: item.image
      })),
      customer: user ? { name: user.name, email: user.email } : formData,
      paymentId: paymentIntent.id
    }

    // Save order to database (supports both logged-in and guest users)
    try {
      await ordersService.create({
        userId: user?.id || null,
        guestEmail: user ? null : formData.email,
        guestName: user ? null : `${formData.firstName} ${formData.lastName}`,
        paymentMethod: "card",
        subtotal: orderTotal - 5,
        shippingCost: 5,
        discount: 0,
        total: orderTotal,
        items: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color,
          image: item.image
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone
        }
      })
      console.log("Order saved to database")
    } catch (dbError) {
      console.error("Error saving to database:", dbError)
      // Fallback to localStorage
    }
    
    // Save order to user's order history (localStorage fallback)
    if (user && user.id) {
      const ordersKey = `orders_${user.id}`
      const existingOrders = localStorage.getItem(ordersKey)
      const orders = existingOrders ? JSON.parse(existingOrders) : []
      orders.unshift(order) // Add new order at the beginning
      localStorage.setItem(ordersKey, JSON.stringify(orders))
      console.log("Order saved to user history:", order.id)
    }
    
    // Also save to main orders array for admin panel
    const mainOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    const adminOrder = {
      ...order,
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city
      },
      paymentStatus: "succeeded",
      status: "pending", // Save as pending so admin gets notification
      createdAt: new Date().toISOString()
    }
    mainOrders.unshift(adminOrder)
    localStorage.setItem("orders", JSON.stringify(mainOrders))
    console.log("Order saved to admin panel:", order.id)
    
    // Clear cart and checkout data
    localStorage.removeItem("checkoutCart")
    localStorage.removeItem("checkoutData")
    // Dispatch event to clear cart context
    window.dispatchEvent(new CustomEvent("cartCleared"))
    
    // Show success and redirect
    alert("Payment successful! Thank you for your order.\n\nOrder ID: " + order.id)
    navigate("/")
  }

  const handlePaymentError = (error) => {
    setPaymentError(error)
    console.error("Payment error:", error)
  }

  const handleBack = () => {
    setStep(1)
    setPaymentError("")
  }

  // Show login prompt if not authenticated
  if (showLoginPrompt) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8 bg-gray-50">
        <div className="max-w-md w-full mx-4 p-8 bg-white rounded-2xl shadow-xl text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <FaLock className="text-3xl text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">
            Please login or create an account to complete your checkout and track your orders.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/login", { state: { from: { pathname: "/checkout" } } })}
              className="w-full py-3 px-6 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/login", { state: { from: { pathname: "/checkout" } } })}
              className="w-full py-3 px-6 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Create Account
            </button>
          </div>
          <button
            onClick={() => navigate("/")}
            className="mt-4 text-gray-500 hover:text-gray-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="container px-4 mx-auto">
        <h1 className="mb-8 text-3xl font-bold text-center">Checkout</h1>
        
        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 1 ? "bg-red-600 text-white" : "bg-gray-300 text-gray-500"
            }`}>
              <FaCheck className={step > 1 ? "block" : "hidden"} />
              {step === 1 && "1"}
            </div>
            <span className="ml-2 font-medium">Contact Details</span>
          </div>
          <div className="w-16 h-1 mx-4 bg-gray-300">
            <div className={`h-full bg-red-600 ${step === 1 ? "w-0" : "w-full"}`}></div>
          </div>
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= 2 ? "bg-red-600 text-white" : "bg-gray-300 text-gray-500"
            }`}>
              2
            </div>
            <span className="ml-2 font-medium">Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Column - Form */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            {step === 1 ? (
              <form onSubmit={handleSubmitContact}>
                <h2 className="flex items-center mb-4 text-xl font-semibold">
                  <FaLock className="mr-2" /> Contact Details
                </h2>
                
                <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="+256 700 000 000"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      State
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="Alabama">Alabama</option>
                      <option value="Alaska">Alaska</option>
                      <option value="Arizona">Arizona</option>
                      <option value="Arkansas">Arkansas</option>
                      <option value="California">California</option>
                      <option value="Colorado">Colorado</option>
                      <option value="Connecticut">Connecticut</option>
                      <option value="Delaware">Delaware</option>
                      <option value="Florida">Florida</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Hawaii">Hawaii</option>
                      <option value="Idaho">Idaho</option>
                      <option value="Illinois">Illinois</option>
                      <option value="Indiana">Indiana</option>
                      <option value="Iowa">Iowa</option>
                      <option value="Kansas">Kansas</option>
                      <option value="Kentucky">Kentucky</option>
                      <option value="Louisiana">Louisiana</option>
                      <option value="Maine">Maine</option>
                      <option value="Maryland">Maryland</option>
                      <option value="Massachusetts">Massachusetts</option>
                      <option value="Michigan">Michigan</option>
                      <option value="Minnesota">Minnesota</option>
                      <option value="Mississippi">Mississippi</option>
                      <option value="Missouri">Missouri</option>
                      <option value="Montana">Montana</option>
                      <option value="Nebraska">Nebraska</option>
                      <option value="Nevada">Nevada</option>
                      <option value="New Hampshire">New Hampshire</option>
                      <option value="New Jersey">New Jersey</option>
                      <option value="New Mexico">New Mexico</option>
                      <option value="New York">New York</option>
                      <option value="North Carolina">North Carolina</option>
                      <option value="North Dakota">North Dakota</option>
                      <option value="Ohio">Ohio</option>
                      <option value="Oklahoma">Oklahoma</option>
                      <option value="Oregon">Oregon</option>
                      <option value="Pennsylvania">Pennsylvania</option>
                      <option value="Rhode Island">Rhode Island</option>
                      <option value="South Carolina">South Carolina</option>
                      <option value="South Dakota">South Dakota</option>
                      <option value="Tennessee">Tennessee</option>
                      <option value="Texas">Texas</option>
                      <option value="Utah">Utah</option>
                      <option value="Vermont">Vermont</option>
                      <option value="Virginia">Virginia</option>
                      <option value="Washington">Washington</option>
                      <option value="West Virginia">West Virginia</option>
                      <option value="Wisconsin">Wisconsin</option>
                      <option value="Wyoming">Wyoming</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 font-semibold text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                >
                  {isProcessing ? "Processing..." : "Continue to Payment"}
                </button>
              </form>
            ) : (
              <div>
                <h2 className="flex items-center mb-4 text-xl font-semibold">
                  <FaCreditCard className="mr-2" /> Payment
                </h2>
                
                <div className="p-4 mb-6 rounded-lg bg-gray-50">
                  <h3 className="mb-2 font-medium">Shipping To</h3>
                  <p className="text-sm text-gray-600">
                    {formData.firstName} {formData.lastName}<br />
                    {formData.email}<br />
                    {formData.phone}<br />
                    {formData.address}, {formData.city}<br />
                    {formData.country}
                  </p>
                  <button 
                    onClick={handleBack}
                    className="mt-2 text-sm text-red-600 hover:underline"
                  >
                    Edit
                  </button>
                </div>

                {paymentError && (
                  <div className="p-4 mb-4 border border-red-200 rounded-lg bg-red-50">
                    <p className="text-sm text-red-600">{paymentError}</p>
                  </div>
                )}

                {/* Stripe Elements Provider */}
                {clientSecret && (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm 
                      clientSecret={clientSecret}
                      orderTotal={orderTotal}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      onBack={handleBack}
                    />
                  </Elements>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="p-6 bg-white rounded-lg shadow-md h-fit">
            <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
            
            {/* Cart Items */}
            <div className="mb-6 space-y-4">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex gap-4">
                  <div className="relative">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="object-cover w-20 h-20 rounded-lg"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-20 h-20 bg-gray-200 rounded-lg">
                        <FaCreditCard className="text-gray-400" />
                      </div>
                    )}
                    <span className="absolute flex items-center justify-center w-6 h-6 text-xs text-white bg-red-600 rounded-full -top-2 -right-2">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                    {item.color && <p className="text-sm text-gray-500">Color: {item.color}</p>}
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.productId)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="pt-4 space-y-2 border-t">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${(orderTotal - 5).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>$5.00</span>
              </div>
              <div className="flex justify-between pt-2 text-xl font-bold text-gray-800 border-t">
                <span>Total</span>
                <span className="text-red-600">${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Methods Info */}
            <div className="p-4 mt-6 rounded-lg bg-gray-50">
              <p className="mb-2 text-sm text-gray-600">We accept payments from:</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 text-xs bg-white border rounded">Visa</span>
                <span className="px-2 py-1 text-xs bg-white border rounded">Mastercard</span>
                <span className="px-2 py-1 text-xs bg-white border rounded">American Express</span>
                <span className="px-2 py-1 text-xs bg-white border rounded">Discover</span>
              </div>
            </div>

            {/* Stripe Badge */}
            <div className="flex items-center justify-center gap-2 mt-4 text-gray-500">
              <span className="text-sm">Powered by</span>
              <span className="text-lg font-bold" style={{ color: "#635BFF" }}>stripe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
