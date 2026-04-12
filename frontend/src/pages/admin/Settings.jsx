import { useState, useEffect } from "react"
import { 
  FaStore, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarker, 
  FaGlobe,
  FaShippingFast,
  FaDollarSign,
  FaCreditCard,
  FaSave,
  FaUser,
  FaLock,
  FaBell,
  FaMoon,
  FaSun,
  FaPalette
} from "react-icons/fa"
import { useNotification } from "../../App"

const Settings = () => {
  const [settings, setSettings] = useState({
    // Store Info
    storeName: "Aromo-Mit Fashions",
    storeEmail: "contact@aromomit.com",
    storePhone: "+256 700 000 000",
    storeAddress: "Kampala, Uganda",
    storeWebsite: "www.aromomit.com",
    
    // Business Settings
    currency: "USD",
    taxRate: "18",
    shippingCost: "5",
    freeShippingThreshold: "100",
    
    // Payment Settings
    stripeEnabled: true,
    paypalEnabled: false,
    
    // Notification Settings
    orderNotifications: true,
    lowStockAlerts: true,
    customerNotifications: true,
  })
  
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState("appearance")
  const showNotification = useNotification()

  // Load settings from localStorage
  useEffect(() => {
    const loadSettings = () => {
      try {
        const storedSettings = JSON.parse(localStorage.getItem("adminSettings") || "{}")
        const storedDarkMode = localStorage.getItem("adminDarkMode") === "true"
        
        setSettings({ ...settings, ...storedSettings })
        setDarkMode(storedDarkMode)
        
        // Apply dark mode to admin panel
        if (storedDarkMode) {
          document.documentElement.classList.add("dark")
        }
      } catch (error) {
        console.error("Error loading settings:", error)
      }
    }

    loadSettings()
  }, [])

  const handleSave = () => {
    try {
      localStorage.setItem("adminSettings", JSON.stringify(settings))
      showNotification("success", "Settings saved successfully!")
    } catch (error) {
      showNotification("error", "Failed to save settings")
    }
  }

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem("adminDarkMode", newDarkMode.toString())
    
    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    
    showNotification("success", newDarkMode ? "Dark mode enabled" : "Light mode enabled")
  }

  const tabs = [
    { id: "appearance", label: "Appearance", icon: FaPalette },
    { id: "store", label: "Store Info", icon: FaStore },
    { id: "business", label: "Business", icon: FaDollarSign },
    { id: "payment", label: "Payment", icon: FaCreditCard },
    { id: "notifications", label: "Notifications", icon: FaBell },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Sidebar Tabs */}
        <div className="flex-shrink-0 md:w-64">
          <div className="p-2 bg-white border border-gray-100 shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? "bg-red-600 text-white"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <tab.icon />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 bg-white border border-gray-100 shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700">
          
          {/* Appearance Settings */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">Appearance</h3>
                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Customize the admin panel appearance</p>
              </div>
              
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-600">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    {darkMode ? (
                      <FaMoon className="text-xl text-yellow-500" />
                    ) : (
                      <FaSun className="text-xl text-yellow-500" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Dark Mode</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {darkMode ? "Currently using dark theme" : "Currently using light theme"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDarkModeToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    darkMode ? "bg-red-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      darkMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Note:</strong> The dark mode toggle affects only the admin panel. The main website appearance is controlled separately.
                </p>
              </div>
            </div>
          )}

          {/* Store Info */}
          {activeTab === "store" && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">Store Information</h3>
                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Basic information about your store</p>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Store Name</label>
                  <div className="relative">
                    <FaStore className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                    <input
                      type="text"
                      value={settings.storeName}
                      onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                      className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <div className="relative">
                    <FaEnvelope className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                    <input
                      type="email"
                      value={settings.storeEmail}
                      onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                      className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                  <div className="relative">
                    <FaPhone className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                    <input
                      type="tel"
                      value={settings.storePhone}
                      onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                      className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Website</label>
                  <div className="relative">
                    <FaGlobe className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                    <input
                      type="text"
                      value={settings.storeWebsite}
                      onChange={(e) => setSettings({ ...settings, storeWebsite: e.target.value })}
                      className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                  <div className="relative">
                    <FaMapMarker className="absolute left-3 top-3 text-gray-400" />
                    <textarea
                      value={settings.storeAddress}
                      onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                      className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      rows="2"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Business Settings */}
          {activeTab === "business" && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">Business Settings</h3>
                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Configure pricing and shipping</p>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Currency</label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                    className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="UGX">UGX - Ugandan Shilling</option>
                    <option value="KES">KES - Kenyan Shilling</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Tax Rate (%)</label>
                  <div className="relative">
                    <FaDollarSign className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                    <input
                      type="number"
                      value={settings.taxRate}
                      onChange={(e) => setSettings({ ...settings, taxRate: e.target.value })}
                      className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Shipping Cost ($)</label>
                  <div className="relative">
                    <FaShippingFast className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                    <input
                      type="number"
                      value={settings.shippingCost}
                      onChange={(e) => setSettings({ ...settings, shippingCost: e.target.value })}
                      className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Free Shipping Threshold ($)</label>
                  <div className="relative">
                    <FaDollarSign className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                    <input
                      type="number"
                      value={settings.freeShippingThreshold}
                      onChange={(e) => setSettings({ ...settings, freeShippingThreshold: e.target.value })}
                      className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === "payment" && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">Payment Settings</h3>
                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Configure payment methods</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-600">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
                      <FaCreditCard className="text-xl text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white">Stripe Payments</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Accept credit card payments</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, stripeEnabled: !settings.stripeEnabled })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.stripeEnabled ? "bg-green-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.stripeEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-600">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                      <FaCreditCard className="text-xl text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white">PayPal</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Accept PayPal payments</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, paypalEnabled: !settings.paypalEnabled })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.paypalEnabled ? "bg-green-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.paypalEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">Notification Settings</h3>
                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">Configure email notifications</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-600">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Order Notifications</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when new orders are placed</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, orderNotifications: !settings.orderNotifications })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.orderNotifications ? "bg-green-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.orderNotifications ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-600">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Low Stock Alerts</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when products are running low</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, lowStockAlerts: !settings.lowStockAlerts })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.lowStockAlerts ? "bg-green-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.lowStockAlerts ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-600">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">Customer Notifications</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when new customers register</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, customerNotifications: !settings.customerNotifications })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.customerNotifications ? "bg-green-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.customerNotifications ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
            >
              <FaSave />
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
