import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaSearch, FaBox, FaCheckCircle, FaShippingFast, FaHome, FaClock, FaChevronRight } from "react-icons/fa"
import { useNotification } from "../App"
import { ordersService } from "../lib/database"
import man1 from "../assets/man1.webp"

const OrderTracking = () => {
  const navigate = useNavigate()
  const showNotification = useNotification()
  const [orderNumber, setOrderNumber] = useState("")
  const [email, setEmail] = useState("")
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [statusHistory, setStatusHistory] = useState([])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!orderNumber) {
      showNotification("error", "Please enter order number")
      return
    }

    setLoading(true)
    setError("")
    setOrder(null)

    try {
      const { data, error } = await ordersService.getByNumber(orderNumber.toUpperCase())
      if (!error && data) {
        setOrder(data)
        // Load status history
        const { data: history } = await ordersService.getStatusHistory(data.id)
        if (history) setStatusHistory(history)
      } else {
        setError("Order not found. Please check the order number.")
      }
    } catch (err) {
      console.error("Error searching order:", err)
      setError("Failed to find order. Please try again.")
    }
    setLoading(false)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaClock className="w-6 h-6" />
      case "paid":
        return <FaCheckCircle className="w-6 h-6" />
      case "shipped":
        return <FaShippingFast className="w-6 h-6" />
      case "delivered":
        return <FaHome className="w-6 h-6" />
      default:
        return <FaBox className="w-6 h-6" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-600"
      case "paid":
        return "bg-green-100 text-green-600"
      case "shipped":
        return "bg-blue-100 text-blue-600"
      case "delivered":
        return "bg-green-100 text-green-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const getCurrentStatusStep = (status) => {
    const steps = ["pending", "paid", "shipped", "delivered"]
    return steps.indexOf(status)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Track Your Order</h1>
          <p className="mt-2 text-gray-600">Enter your order number to track shipment status</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Number</label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g., AMF-2403-ABC123"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (for guest orders)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                <FaSearch />
                {loading ? "Searching..." : "Track"}
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Order Details */}
        {order && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-900 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm">Order Number</p>
                  <p className="text-white text-xl font-bold">{order.order_number}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">Order Date</p>
                  <p className="text-white font-medium">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <img
                      src={item.image || man1}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} {item.size && `| Size: ${item.size}`}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${order.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">${order.shipping_cost?.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-medium text-green-600">-${order.discount?.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold mt-2">
                  <span>Total</span>
                  <span className="text-red-600">${order.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Tracking Status */}
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-6">Order Status</h3>
              <div className="flex items-center justify-between relative">
                {/* Progress line */}
                <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-10">
                  <div 
                    className="h-full bg-red-600 transition-all duration-500"
                    style={{ width: `${(getCurrentStatusStep(order.status) / 3) * 100}%` }}
                  ></div>
                </div>
                
                {["pending", "paid", "shipped", "delivered"].map((step, index) => (
                  <div key={step} className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      index <= getCurrentStatusStep(order.status)
                        ? "bg-red-600 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}>
                      {getStatusIcon(step)}
                    </div>
                    <p className={`mt-2 text-sm font-medium ${
                      index <= getCurrentStatusStep(order.status) ? "text-gray-900" : "text-gray-400"
                    }`}>
                      {step.charAt(0).toUpperCase() + step.slice(1)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Tracking Number */}
              {order.tracking_number && (
                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-800">
                    <FaShippingFast />
                    <span className="font-medium">Tracking: {order.tracking_number}</span>
                  </div>
                  {order.carrier && (
                    <p className="text-sm text-blue-600 mt-1">Carrier: {order.carrier}</p>
                  )}
                  {order.estimated_delivery && (
                    <p className="text-sm text-blue-600">Expected Delivery: {new Date(order.estimated_delivery).toLocaleDateString()}</p>
                  )}
                </div>
              )}
            </div>

            {/* Status History */}
            {statusHistory.length > 0 && (
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Order History</h3>
                <div className="space-y-3">
                  {statusHistory.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <FaChevronRight className="w-4 h-4 text-gray-400 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">{item.status}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(item.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderTracking
