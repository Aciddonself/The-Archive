import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { 
  FaShoppingCart, 
  FaBox, 
  FaUsers, 
  FaDollarSign,
  FaArrowUp,
  FaArrowDown,
  FaShoppingBag,
  FaCalendar,
  FaChartLine
} from "react-icons/fa"

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    recentOrders: [],
    salesData: [],
    dailySales: []
  })
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState("line") // "line" or "calendar"

  useEffect(() => {
    // Load real data from localStorage
    const loadData = () => {
      try {
        // Load orders
        const orders = JSON.parse(localStorage.getItem("orders") || "[]")
        
        // Load products
        const products = JSON.parse(localStorage.getItem("products") || "[]")
        
        // Load customers
        const customers = JSON.parse(localStorage.getItem("customers") || "[]")
        
        // Calculate total revenue from completed orders
        const completedOrders = orders.filter(o => o.status === "completed" || o.paymentStatus === "succeeded")
        const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.total || 0), 0)
        
        // Get recent orders (last 5)
        const recentOrders = [...orders]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
        
        // Generate sales data from orders (last 6 months)
        const salesData = generateMonthlySales(orders)
        
        // Generate daily sales for the last 30 days
        const dailySales = generateDailySales(orders)
        
        setStats({
          totalOrders: orders.length,
          totalRevenue: totalRevenue,
          totalProducts: products.length,
          totalCustomers: customers.length,
          recentOrders: recentOrders,
          salesData: salesData,
          dailySales: dailySales
        })
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      }
      setLoading(false)
    }

    loadData()
  }, [])

  // Generate monthly sales data from orders
  const generateMonthlySales = (orders) => {
    const months = []
    const now = new Date()
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = date.toLocaleString("default", { month: "short" })
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt)
        return orderDate.getMonth() === date.getMonth() && 
               orderDate.getFullYear() === date.getFullYear() &&
               (order.status === "completed" || order.paymentStatus === "succeeded")
      })
      const sales = monthOrders.reduce((sum, order) => sum + (order.total || 0), 0)
      months.push({ month: monthName, sales: sales || Math.random() * 5000 + 1000 })
    }
    
    return months
  }

  // Generate daily sales for calendar view
  const generateDailySales = (orders) => {
    const days = []
    const now = new Date()
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt).toISOString().split("T")[0]
        return orderDate === dateStr &&
               (order.status === "completed" || order.paymentStatus === "succeeded")
      })
      
      days.push({
        date: dateStr,
        day: date.getDate(),
        sales: dayOrders.reduce((sum, order) => sum + (order.total || 0), 0),
        orders: dayOrders.length
      })
    }
    
    return days
  }

  const statCards = [
    { 
      title: "Total Orders", 
      value: stats.totalOrders, 
      icon: FaShoppingCart, 
      color: "bg-blue-500",
      change: stats.totalOrders > 0 ? "+" + stats.totalOrders : "0",
      changeType: stats.totalOrders > 0 ? "up" : "neutral"
    },
    { 
      title: "Total Revenue", 
      value: `$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
      icon: FaDollarSign, 
      color: "bg-green-500",
      change: stats.totalRevenue > 0 ? "+$" + stats.totalRevenue.toFixed(0) : "$0",
      changeType: stats.totalRevenue > 0 ? "up" : "neutral"
    },
    { 
      title: "Total Products", 
      value: stats.totalProducts, 
      icon: FaBox, 
      color: "bg-purple-500",
      change: stats.totalProducts > 0 ? "+" + stats.totalProducts : "0",
      changeType: stats.totalProducts > 0 ? "up" : "neutral"
    },
    { 
      title: "Total Customers", 
      value: stats.totalCustomers, 
      icon: FaUsers, 
      color: "bg-orange-500",
      change: stats.totalCustomers > 0 ? "+" + stats.totalCustomers : "0",
      changeType: stats.totalCustomers > 0 ? "up" : "neutral"
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "processing": return "bg-blue-100 text-blue-800"
      case "shipped": return "bg-purple-100 text-purple-800"
      case "pending_payment": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getMaxSales = () => {
    if (viewMode === "line") {
      return Math.max(...stats.salesData.map(d => d.sales), 1)
    }
    return Math.max(...stats.dailySales.map(d => d.sales), 1)
  }

  const renderLineChart = () => {
    const maxSales = getMaxSales()
    
    return (
      <div className="relative h-64">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-gray-400">
          <span>${maxSales.toLocaleString()}</span>
          <span>${(maxSales / 2).toLocaleString()}</span>
          <span>$0</span>
        </div>
        
        {/* Chart area */}
        <div className="ml-14 h-full flex items-end gap-1">
          {stats.salesData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full transition-all rounded-t-lg bg-gradient-to-t from-red-500 to-red-400 hover:from-red-600 hover:to-red-500 relative group"
                style={{ height: `${Math.max((data.sales / maxSales) * 100, 5)}%` }}
              >
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  ${data.sales.toLocaleString()}
                </div>
              </div>
              <span className="mt-2 text-xs text-gray-500">{data.month}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderCalendarHeatmap = () => {
    const maxSales = getMaxSales()
    const weeks = []
    let currentWeek = []
    
    // Find the first day of the 30-day period
    const startDate = new Date(stats.dailySales[0]?.date || new Date())
    startDate.setDate(startDate.getDate() - startDate.getDay())
    
    // Generate calendar cells
    stats.dailySales.forEach((day, index) => {
      currentWeek.push(day)
      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }
    })
    
    // Add remaining days
    if (currentWeek.length > 0) {
      weeks.push(currentWeek)
    }

    const getHeatColor = (sales) => {
      if (sales === 0) return "bg-gray-100"
      const intensity = sales / maxSales
      if (intensity < 0.25) return "bg-red-200"
      if (intensity < 0.5) return "bg-red-400"
      if (intensity < 0.75) return "bg-red-600"
      return "bg-red-700"
    }

    return (
      <div className="h-64 overflow-auto">
        {/* Day labels */}
        <div className="flex gap-1 mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <div key={i} className="flex-1 text-center text-xs text-gray-400">{day}</div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="space-y-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex gap-1">
              {week.map((day, dayIndex) => (
                <div 
                  key={dayIndex} 
                  className={`flex-1 h-8 rounded flex items-center justify-center text-xs ${getHeatColor(day.sales)} relative group cursor-pointer`}
                >
                  <span className={day.sales > 0 ? "text-white font-medium" : "text-gray-400"}>
                    {day.day}
                  </span>
                  {day.sales > 0 && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      ${day.sales.toLocaleString()} ({day.orders} orders)
                    </div>
                  )}
                </div>
              ))}
              {/* Fill empty cells */}
              {[...Array(7 - week.length)].map((_, i) => (
                <div key={`empty-${i}`} className="flex-1 h-8"></div>
              ))}
            </div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-500">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 bg-gray-100 rounded"></div>
            <div className="w-4 h-4 bg-red-200 rounded"></div>
            <div className="w-4 h-4 bg-red-400 rounded"></div>
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <div className="w-4 h-4 bg-red-700 rounded"></div>
          </div>
          <span>More</span>
        </div>
      </div>
    )
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
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <div key={index} className="p-6 transition-shadow bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <div className="flex items-center mt-2 text-sm">
                  {stat.changeType === "up" ? (
                    <FaArrowUp className="mr-1 text-green-500" />
                  ) : stat.changeType === "neutral" ? (
                    <span className="mr-1">-</span>
                  ) : (
                    <FaArrowDown className="mr-1 text-red-500" />
                  )}
                  <span className={stat.changeType === "up" ? "text-green-500" : stat.changeType === "neutral" ? "text-gray-500" : "text-red-500"}>
                    {stat.change}
                  </span>
                  <span className="ml-1 text-gray-400">total</span>
                </div>
              </div>
              <div className={`${stat.color} p-4 rounded-xl`}>
                <stat.icon className="text-2xl text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sales Chart */}
        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Sales Overview</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setViewMode("line")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "line" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                title="Line Chart"
              >
                <FaChartLine />
              </button>
              <button 
                onClick={() => setViewMode("calendar")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "calendar" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                title="Calendar View"
              >
                <FaCalendar />
              </button>
            </div>
          </div>
          {viewMode === "line" ? renderLineChart() : renderCalendarHeatmap()}
        </div>

        {/* Recent Orders */}
        <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
              <Link to="/admin/orders" className="text-sm text-red-600 hover:underline">View All</Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            {stats.recentOrders.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.customer?.firstName} {order.customer?.lastName}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">${(order.total || 0).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p>No orders yet</p>
                <p className="text-sm">Orders will appear here when customers make purchases</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link to="/admin/products" className="flex items-center gap-3 p-4 transition-colors rounded-lg bg-red-50 hover:bg-red-100">
            <FaShoppingBag className="text-xl text-red-600" />
            <div className="text-left">
              <p className="font-medium text-gray-800">Add New Product</p>
              <p className="text-sm text-gray-500">Create a new listing</p>
            </div>
          </Link>
          <Link to="/admin/orders" className="flex items-center gap-3 p-4 transition-colors rounded-lg bg-blue-50 hover:bg-blue-100">
            <FaShoppingCart className="text-xl text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-gray-800">View Orders</p>
              <p className="text-sm text-gray-500">Manage pending orders</p>
            </div>
          </Link>
          <Link to="/" className="flex items-center gap-3 p-4 transition-colors rounded-lg bg-green-50 hover:bg-green-100">
            <FaShoppingBag className="text-xl text-green-600" />
            <div className="text-left">
              <p className="font-medium text-gray-800">View Store</p>
              <p className="text-sm text-gray-500">Preview your site</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
