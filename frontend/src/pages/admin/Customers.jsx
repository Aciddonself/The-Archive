import { useState, useEffect } from "react"
import { 
  FaSearch, 
  FaUser, 
  FaEnvelope, 
  FaPhone,
  FaMapMarker,
  FaShoppingCart,
  FaDollarSign,
  FaEye,
  FaEdit,
  FaTrash,
  FaFilter,
  FaSort,
  FaUserPlus,
  FaComment
} from "react-icons/fa"
import { IoLogoWhatsapp } from "react-icons/io5"

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Load customers and their order data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        // Load customers
        const storedCustomers = JSON.parse(localStorage.getItem("customers") || "[]")
        
        // Load orders
        const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
        
        // Calculate real orders and spent for each customer
        const customersWithOrders = storedCustomers
          .filter(customer => customer.role === "customer") // Only show customers, not admins
          .map(customer => {
            // Find orders for this customer
            const customerOrders = storedOrders.filter(order => 
              order.customer?.email === customer.email
            )
            
            const totalSpent = customerOrders
              .filter(order => order.paymentStatus === "succeeded" || order.status === "completed")
              .reduce((sum, order) => sum + (order.total || 0), 0)
            
            return {
              ...customer,
              orders: customerOrders.length,
              spent: totalSpent,
              status: customerOrders.length > 0 ? "active" : "new",
              lastOrder: customerOrders.length > 0 
                ? customerOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0].createdAt
                : null
            }
          })
        
        setCustomers(customersWithOrders)
      } catch (error) {
        console.error("Error loading customers:", error)
      }
      setLoading(false)
    }

    loadData()
  }, [])
  
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [showChatModal, setShowChatModal] = useState(false)
  const [chatCustomer, setChatCustomer] = useState(null)
  const [whatsappNumber, setWhatsappNumber] = useState("")

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800"
      case "new": return "bg-blue-100 text-blue-800"
      case "inactive": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm)
    const matchesFilter = filterStatus === "all" || customer.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer)
    setShowModal(true)
  }

  const handleDeleteCustomer = (customer) => {
    const updatedCustomers = customers.filter(c => c.id !== customer.id)
    localStorage.setItem("customers", JSON.stringify(updatedCustomers.filter(c => c.role === "customer")))
    setCustomers(updatedCustomers)
    setDeleteConfirm(null)
  }

  const handleChatClick = (customer) => {
    setChatCustomer(customer)
    setWhatsappNumber(customer.phone || "")
    setShowChatModal(true)
  }

  const handleWhatsAppChat = () => {
    if (whatsappNumber) {
      // Format phone number for WhatsApp (remove any non-digits)
      const cleanNumber = whatsappNumber.replace(/\D/g, "")
      // Open WhatsApp with pre-filled message
      window.open(`https://wa.me/${cleanNumber}?text=Hello%20${encodeURIComponent(chatCustomer?.name || "Customer")},%20how%20can%20we%20help%20you%20today?`, "_blank")
    } else {
      alert("Please enter a phone number for WhatsApp chat")
    }
  }

  const handleWebsiteChat = () => {
    // Store the customer info for the chat
    localStorage.setItem("adminChatCustomer", JSON.stringify(chatCustomer))
    // Navigate to admin chat page
    window.location.href = "/admin/chat"
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === "active").length,
    new: customers.filter(c => c.status === "new").length,
    totalRevenue: customers.reduce((sum, c) => sum + (c.spent || 0), 0)
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <p className="text-sm text-gray-500">Total Customers</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <p className="text-sm text-gray-500">Active Customers</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <p className="text-sm text-gray-500">New Customers</p>
          <p className="text-2xl font-bold text-blue-600">{stats.new}</p>
        </div>
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-800">${stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <FaSearch className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search customers by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="new">New</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
        {filteredCustomers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Orders</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Total Spent</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Joined</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
                          <span className="text-sm font-medium text-red-600">
                            {customer.name?.charAt(0).toUpperCase() || "U"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{customer.name}</p>
                          <p className="text-xs text-gray-500">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{customer.phone || "N/A"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-800">{customer.orders}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-800">${(customer.spent || 0).toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{formatDate(customer.createdAt)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleChatClick(customer)}
                          className="p-2 text-green-600 transition-colors rounded-lg hover:bg-green-50"
                          title="Chat with Customer"
                        >
                          <FaComment />
                        </button>
                        <button
                          onClick={() => handleViewCustomer(customer)}
                          className="p-2 text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(customer)}
                          className="p-2 text-red-600 transition-colors rounded-lg hover:bg-red-50"
                          title="Delete"
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
            <FaUserPlus className="mx-auto mb-4 text-4xl text-gray-300" />
            <p className="text-gray-500">No customers found</p>
            <p className="text-sm text-gray-400">Customers will appear here when they register on the website</p>
          </div>
        )}
      </div>

      {/* Customer Detail Modal */}
      {showModal && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">Customer Details</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
                  <span className="text-2xl font-medium text-red-600">
                    {selectedCustomer.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">{selectedCustomer.name}</h4>
                  <p className="text-gray-500">Customer since {formatDate(selectedCustomer.createdAt)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{selectedCustomer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-800">{selectedCustomer.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="font-medium text-gray-800">{selectedCustomer.orders}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Spent</p>
                  <p className="font-medium text-gray-800">${(selectedCustomer.spent || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCustomer.status)}`}>
                    {selectedCustomer.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Order</p>
                  <p className="font-medium text-gray-800">{formatDate(selectedCustomer.lastOrder)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-xl">
            <h3 className="mb-4 text-lg font-bold text-gray-800">Delete Customer</h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCustomer(deleteConfirm)}
                className="px-4 py-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChatModal && chatCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Chat with {chatCustomer.name}</h3>
              <button onClick={() => setShowChatModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            
            <p className="mb-4 text-gray-600">Choose how you want to chat with this customer:</p>
            
            {/* WhatsApp Option */}
            <div className="p-4 mb-4 border border-green-200 rounded-lg bg-green-50">
              <div className="flex items-center gap-3 mb-3">
                <IoLogoWhatsapp className="text-2xl text-green-600" />
                <span className="font-semibold text-green-800">WhatsApp Chat</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={handleWhatsAppChat}
                  className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                >
                  Open
                </button>
              </div>
            </div>
            
            {/* Website Chat Option */}
            <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <div className="flex items-center gap-3 mb-3">
                <FaComment className="text-2xl text-blue-600" />
                <span className="font-semibold text-blue-800">Website Chat</span>
              </div>
              <p className="mb-3 text-sm text-gray-600">Chat directly through the website messaging system.</p>
              <button
                onClick={handleWebsiteChat}
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Start Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Customers
