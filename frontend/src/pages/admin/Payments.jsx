import { useState, useEffect } from "react"
import { 
  FaCreditCard, 
  FaMoneyBillWave, 
  FaChartLine, 
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaDownload,
  FaFilter,
  FaWallet
} from "react-icons/fa"

const Payments = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("all")

  // Load payments from orders in localStorage
  useEffect(() => {
    const loadPayments = () => {
      try {
        const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
        
        // Extract payments from orders
        const extractedPayments = storedOrders.map(order => ({
          id: order.stripePaymentIntentId || `PAY-${order.id}`,
          orderId: order.id,
          method: "card",
          amount: order.total || 0,
          status: order.paymentStatus || order.status || "pending",
          date: order.createdAt,
          customer: order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : "Unknown"
        }))
        
        // Sort by date descending
        extractedPayments.sort((a, b) => new Date(b.date) - new Date(a.date))
        
        setPayments(extractedPayments)
      } catch (error) {
        console.error("Error loading payments:", error)
      }
      setLoading(false)
    }

    loadPayments()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800"
      case "succeeded": return "bg-green-100 text-green-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "pending_payment": return "bg-yellow-100 text-yellow-800"
      case "failed": return "bg-red-100 text-red-800"
      case "refunded": return "bg-gray-100 text-gray-800"
      case "processing": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
      case "succeeded": return <FaCheckCircle className="text-green-600" />
      case "pending":
      case "pending_payment": return <FaClock className="text-yellow-600" />
      case "failed": return <FaTimesCircle className="text-red-600" />
      case "refunded": return <FaClock className="text-gray-600" />
      case "processing": return <FaClock className="text-blue-600" />
      default: return <FaClock className="text-gray-600" />
    }
  }

  const filteredPayments = payments.filter(p => 
    filterStatus === "all" || p.status === filterStatus || p.status === filterStatus.replace("_", "")
  )

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const stats = {
    total: payments.length,
    completed: payments.filter(p => p.status === "completed" || p.status === "succeeded").length,
    pending: payments.filter(p => p.status === "pending" || p.status === "pending_payment").length,
    failed: payments.filter(p => p.status === "failed").length,
    totalAmount: payments
      .filter(p => p.status === "completed" || p.status === "succeeded")
      .reduce((sum, p) => sum + (p.amount || 0), 0)
  }

  // Calculate daily revenue for chart
  const dailyRevenue = payments
    .filter(p => p.status === "completed" || p.status === "succeeded")
    .reduce((acc, payment) => {
      const date = new Date(payment.date).toLocaleDateString()
      acc[date] = (acc[date] || 0) + payment.amount
      return acc
    }, {})

  const maxRevenue = Math.max(...Object.values(dailyRevenue), 1)

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
          <p className="text-sm text-gray-500">Total Transactions</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <p className="text-sm text-gray-500">Failed</p>
          <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
        </div>
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-800">${stats.totalAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Revenue Chart */}
      {Object.keys(dailyRevenue).length > 0 && (
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">Daily Revenue</h3>
          <div className="flex items-end gap-1 h-40">
            {Object.entries(dailyRevenue).slice(-7).map(([date, amount], index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-red-500 to-red-400 rounded-t transition-all hover:from-red-600 hover:to-red-500"
                  style={{ height: `${(amount / maxRevenue) * 100}%` }}
                ></div>
                <span className="mt-2 text-xs text-gray-500">{new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="flex flex-col gap-4 md:flex-row">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="succeeded">Succeeded</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
        {filteredPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Transaction ID</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Method</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {payment.id.slice(0, 20)}...
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{payment.orderId}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{payment.customer}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaCreditCard className="text-gray-400" />
                        <span className="text-sm text-gray-600">Card</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      ${(payment.amount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        {payment.status?.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(payment.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <FaWallet className="mx-auto text-4xl text-gray-300 mb-4" />
            <p className="text-gray-500">No payments found</p>
            <p className="text-sm text-gray-400">Payments will appear here when customers complete purchases</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Payments
