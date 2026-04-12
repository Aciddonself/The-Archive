import { useState, useEffect } from "react"
import { 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaCheck, 
  FaTimes,
  FaShippingFast,
  FaBox,
  FaDownload,
  FaPrint,
  FaTrash,
  FaArchive
} from "react-icons/fa"

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load orders from localStorage
  useEffect(() => {
    const loadOrders = () => {
      try {
        const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
        // Sort by date descending
        const sortedOrders = storedOrders.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        )
        setOrders(sortedOrders)
      } catch (error) {
        console.error("Error loading orders:", error)
      }
      setLoading(false)
    }

    loadOrders()
  }, [])

  // Save orders to localStorage whenever they change
  const saveOrders = (updatedOrders) => {
    localStorage.setItem("orders", JSON.stringify(updatedOrders))
    setOrders(updatedOrders)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200"
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "pending_payment": return "bg-orange-100 text-orange-800 border-orange-200"
      case "processing": return "bg-blue-100 text-blue-800 border-blue-200"
      case "shipped": return "bg-purple-100 text-purple-800 border-purple-200"
      case "delivered": return "bg-teal-100 text-teal-800 border-teal-200"
      case "cancelled": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPaymentColor = (payment) => {
    switch (payment) {
      case "succeeded": return "text-green-600"
      case "paid": return "text-green-600"
      case "pending": return "text-yellow-600"
      case "pending_payment": return "text-yellow-600"
      case "failed": return "text-red-600"
      case "refunded": return "text-gray-600"
      default: return "text-gray-600"
    }
  }

  const filteredOrders = orders.filter(order => {
    const customerName = `${order.customer?.firstName || ""} ${order.customer?.lastName || ""}`.toLowerCase()
    const matchesSearch = order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customerName.includes(searchTerm.toLowerCase()) ||
                         order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || order.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleStatusChange = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    )
    saveOrders(updatedOrders)
    
    // Update selected order if it's the one being modified
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus })
    }
  }

  const handleDeleteOrder = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      const updatedOrders = orders.filter(order => order.id !== orderId)
      saveOrders(updatedOrders)
    }
  }

  const handleArchiveOrder = (orderId) => {
    if (window.confirm("Are you sure you want to archive this order?")) {
      // Get archived orders
      const archivedOrders = JSON.parse(localStorage.getItem("archivedOrders") || "[]")
      const orderToArchive = orders.find(order => order.id === orderId)
      
      if (orderToArchive) {
        archivedOrders.push({ ...orderToArchive, archivedAt: new Date().toISOString() })
        localStorage.setItem("archivedOrders", JSON.stringify(archivedOrders))
        
        // Remove from active orders
        const updatedOrders = orders.filter(order => order.id !== orderId)
        saveOrders(updatedOrders)
      }
    }
  }

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending" || o.status === "pending_payment").length,
    processing: orders.filter(o => o.status === "processing").length,
    completed: orders.filter(o => o.status === "completed").length,
    revenue: orders.filter(o => o.paymentStatus === "succeeded" || o.payment === "paid").reduce((sum, o) => sum + (o.total || 0), 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getItemsCount = (items) => {
    if (!items || !Array.isArray(items)) return 0
    return items.reduce((sum, item) => sum + (item.quantity || 1), 0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-red-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <p className="text-sm text-gray-500">Processing</p>
          <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
        </div>
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-2xl font-bold text-gray-800">${stats.revenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <FaSearch className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search orders by ID, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="pending_payment">Pending Payment</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Items</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Payment</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{order.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {order.customer?.firstName} {order.customer?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{order.customer?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{getItemsCount(order.items)} items</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">${(order.total || 0).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {order.status?.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium capitalize">
                      <span className={getPaymentColor(order.paymentStatus)}>
                        {order.paymentStatus?.replace("_", " ") || "pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="p-2 text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                          title="View Order"
                        >
                          <FaEye />
                        </button>
                        {order.status === "pending" && (
                          <button
                            onClick={() => handleStatusChange(order.id, "processing")}
                            className="p-2 text-green-600 transition-colors rounded-lg hover:bg-green-50"
                            title="Start Processing"
                          >
                            <FaShippingFast />
                          </button>
                        )}
                        {order.status === "processing" && (
                          <button
                            onClick={() => handleStatusChange(order.id, "shipped")}
                            className="p-2 text-purple-600 transition-colors rounded-lg hover:bg-purple-50"
                            title="Mark as Shipped"
                          >
                            <FaBox />
                          </button>
                        )}
                        {order.status === "shipped" && (
                          <button
                            onClick={() => handleStatusChange(order.id, "delivered")}
                            className="p-2 text-teal-600 transition-colors rounded-lg hover:bg-teal-50"
                            title="Mark as Delivered"
                          >
                            <FaCheck />
                          </button>
                        )}
                        <button
                          onClick={() => handleArchiveOrder(order.id)}
                          className="p-2 text-yellow-600 transition-colors rounded-lg hover:bg-yellow-50"
                          title="Archive Order"
                        >
                          <FaArchive />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-2 text-red-600 transition-colors rounded-lg hover:bg-red-50"
                          title="Delete Order"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-gray-500">No orders found</p>
            <p className="text-sm text-gray-400">Orders will appear here when customers make purchases</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">Order Details - {selectedOrder.id}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium text-gray-800">{selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{selectedOrder.customer?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-800">{selectedOrder.customer?.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium text-gray-800">{formatDate(selectedOrder.createdAt)}</p>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="pt-4 border-t">
                <p className="mb-2 text-sm text-gray-500">Order Items</p>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img src={item.image || "/placeholder.png"} alt={item.name} className="w-12 h-12 object-cover rounded" />
                        <div>
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity} {item.size && `| Size: ${item.size}`} {item.color && `| Color: ${item.color}`}</p>
                        </div>
                      </div>
                      <p className="font-medium text-gray-800">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="mb-2 text-sm text-gray-500">Order Status</p>
                <div className="flex flex-wrap gap-2">
                  {["pending", "processing", "shipped", "delivered", "completed", "cancelled"].map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selectedOrder.id, status)}
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status)} ${
                        selectedOrder.status === status ? "ring-2 ring-offset-2 ring-gray-400" : ""
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-800">${(selectedOrder.total || 0).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders
