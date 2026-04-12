import { useState, useEffect } from "react"
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { 
  FaHome, 
  FaBox, 
  FaShoppingCart, 
  FaUsers, 
  FaChartBar, 
  FaCog, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserShield,
  FaMoneyBillWave,
  FaTag,
  FaPlus,
  FaUserPlus,
  FaBell,
  FaComment
} from "react-icons/fa"

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [newUsersCount, setNewUsersCount] = useState(0)
  const [newOrdersCount, setNewOrdersCount] = useState(0)
  const [supportRequestsCount, setSupportRequestsCount] = useState(0)
  
  // Check for new users, orders, and support requests
  useEffect(() => {
    const checkNewItems = () => {
      try {
        // Check for new users (created in last 24 hours)
        const customers = JSON.parse(localStorage.getItem("customers") || "[]")
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        const newUsers = customers.filter(c => 
          c.role === "customer" && c.createdAt > oneDayAgo
        )
        setNewUsersCount(newUsers.length)
        
        // Check for new orders
        const orders = JSON.parse(localStorage.getItem("orders") || "[]")
        const newOrders = orders.filter(o => 
          o.status === "pending" || o.status === "pending_payment"
        )
        setNewOrdersCount(newOrders.length)
        
        // Check for support requests
        const supportRequests = JSON.parse(localStorage.getItem("supportRequests") || "[]")
        const pendingSupport = supportRequests.filter(r => r.status === "pending")
        setSupportRequestsCount(pendingSupport.length)
      } catch (error) {
        console.error("Error checking new items:", error)
      }
    }
    
    checkNewItems()
    
    // Check every 30 seconds
    const interval = setInterval(checkNewItems, 30000)
    
    // Listen for support request events
    const handleSupportRequest = () => {
      checkNewItems()
    }
    window.addEventListener("supportRequestCreated", handleSupportRequest)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener("supportRequestCreated", handleSupportRequest)
    }
  }, [location.pathname])

  // Generate notifications list
  useEffect(() => {
    const generateNotifications = () => {
      const notifs = []
      
      if (newUsersCount > 0) {
        notifs.push({
          id: "new-users",
          type: "user",
          message: `${newUsersCount} new customer${newUsersCount > 1 ? 's' : ''} registered`,
          time: new Date().toISOString(),
          read: false
        })
      }
      
      if (newOrdersCount > 0) {
        notifs.push({
          id: "new-orders",
          type: "order",
          message: `${newOrdersCount} new order${newOrdersCount > 1 ? 's' : ''} pending`,
          time: new Date().toISOString(),
          read: false
        })
      }
      
      if (supportRequestsCount > 0) {
        notifs.push({
          id: "support-requests",
          type: "support",
          message: `${supportRequestsCount} customer${supportRequestsCount > 1 ? 's' : ''} need${supportRequestsCount === 1 ? 's' : ''} support`,
          time: new Date().toISOString(),
          read: false
        })
      }
      
      setNotifications(notifs)
    }
    
    generateNotifications()
  }, [newUsersCount, newOrdersCount, supportRequestsCount])

  const totalNotifications = notifications.filter(n => !n.read).length

  const handleLogout = () => {
    setShowLogoutConfirm(true)
  }
  
  const confirmLogout = () => {
    logout()
    localStorage.setItem("isLoggedIn", "false")
    navigate("/login")
    setShowLogoutConfirm(false)
  }

  const getUserInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    return "AM"
  }

  const menuItems = [
    { path: "/admin", icon: FaChartBar, label: "Dashboard" },
    { path: "/admin/orders", icon: FaShoppingCart, label: "Orders", badge: newOrdersCount > 0 ? newOrdersCount : null },
    { path: "/admin/products", icon: FaBox, label: "Products" },
    { path: "/admin/customers", icon: FaUsers, label: "Customers", badge: newUsersCount > 0 ? newUsersCount : null },
    { path: "/admin/payments", icon: FaMoneyBillWave, label: "Payments" },
    { path: "/admin/categories", icon: FaTag, label: "Categories" },
    { path: "/admin/promocodes", icon: FaTag, label: "Promo Codes" },
    { path: "/admin/reviews", icon: FaBox, label: "Reviews" },
    { path: "/admin/subadmins", icon: FaUserPlus, label: "Sub-Admins" },
    { path: "/admin/chat", icon: FaComment, label: "Chat", badge: supportRequestsCount > 0 ? supportRequestsCount : null },
    { path: "/admin/settings", icon: FaCog, label: "Settings" },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside 
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 flex flex-col shadow-xl`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {sidebarOpen && (
            <Link to="/admin" className="flex items-center gap-2">
              <FaUserShield className="text-2xl text-red-500" />
              <span className="text-xl font-bold">Aromo-Mit</span>
            </Link>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 transition-colors rounded-lg hover:bg-gray-700"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive(item.path) 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="text-lg" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </div>
              {sidebarOpen && item.badge && (
                <span className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-300 transition-colors rounded-lg hover:bg-gray-700 hover:text-white"
          >
            <FaSignOutAlt className="text-lg" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {menuItems.find(item => item.path === location.pathname)?.label || 'Admin Dashboard'}
              </h1>
              <p className="text-sm text-gray-500">Manage your store</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Notifications Bell */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                >
                  <FaBell className="text-xl" />
                  {totalNotifications > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
                      {totalNotifications}
                    </span>
                  )}
                </button>
                
                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-3 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(notif => (
                          <div 
                            key={notif.id} 
                            className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notif.read ? 'bg-blue-50' : ''}`}
                            onClick={() => {
                              if (notif.type === 'user') {
                                navigate('/admin/customers')
                              } else if (notif.type === 'order') {
                                navigate('/admin/orders')
                              } else if (notif.type === 'support') {
                                navigate('/admin/chat')
                              }
                              setShowNotifications(false)
                            }}
                          >
                            <p className="text-sm text-gray-800">{notif.message}</p>
                            <p className="text-xs text-gray-500 mt-1">Just now</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          No new notifications
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 font-bold text-white bg-red-600 rounded-full">
                  {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : "AM"}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{user?.name || "Admin"}</p>
                  <p className="text-xs text-gray-500">{user?.role === "main_admin" ? "Super Admin" : user?.role === "sub_admin" ? "Sub-Admin" : "Admin"}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Logout</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to log out? You will need to log in again to access the admin panel.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminLayout
