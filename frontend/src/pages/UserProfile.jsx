import { useState, useEffect, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useNotification } from "../App"
import { useAuth } from "../context/AuthContext"
import { ordersService } from "../lib/database"
import { FaBox, FaShippingFast, FaCheckCircle, FaClock, FaEye } from "react-icons/fa"
import man1 from "../assets/man1.webp"
import woman1 from "../assets/woman1.webp"

const UserProfile = () => {
    const navigate = useNavigate()
    const showNotification = useNotification()
    const { user: authUser, logout } = useAuth()
    const [user, setUser] = useState(null)
    const [activeTab, setActiveTab] = useState("profile")
    const [orders, setOrders] = useState([])
    const [isEditing, setIsEditing] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef(null)
    const [editForm, setEditForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: ""
    })

    // Get default avatar based on user gender or use default
    const getDefaultAvatar = () => {
        if (user?.gender === 'female') {
            return woman1
        }
        return man1
    }

    useEffect(() => {
        // Check if user is logged in via AuthContext
        if (!authUser) {
            navigate("/login")
            return
        }

        // Load user with avatar from localStorage
        const savedUser = localStorage.getItem("currentUser")
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser)
            setUser(parsedUser)
            setEditForm({
                name: parsedUser.name || "",
                email: parsedUser.email || "",
                phone: parsedUser.phone || "",
                address: parsedUser.address || ""
            })
        } else {
            setUser(authUser)
            setEditForm({
                name: authUser.name || "",
                email: authUser.email || "",
                phone: authUser.phone || "",
                address: authUser.address || ""
            })
        }
        
        // Load user's order history from database
        const loadOrders = async () => {
            const userId = authUser?.id || savedUser?.id
            if (userId) {
                try {
                    const { data, error } = await ordersService.getByUserId(userId)
                    if (!error && data && data.length > 0) {
                        setOrders(data)
                    } else {
                        // Fallback to localStorage
                        const ordersKey = `orders_${userId}`
                        const savedOrders = localStorage.getItem(ordersKey)
                        if (savedOrders) {
                            setOrders(JSON.parse(savedOrders))
                        }
                    }
                } catch (error) {
                    console.error("Error loading orders:", error)
                    // Fallback to localStorage
                    const ordersKey = `orders_${userId}`
                    const savedOrders = localStorage.getItem(ordersKey)
                    if (savedOrders) {
                        setOrders(JSON.parse(savedOrders))
                    }
                }
            }
        }
        
        loadOrders()
    }, [authUser, navigate])

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            logout()
            showNotification("success", "Logged out successfully!")
            navigate("/login")
        }
    }

    const handleEditSubmit = (e) => {
        e.preventDefault()
        // Update user in localStorage
        const updatedUser = { ...user, ...editForm }
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
        setUser(updatedUser)
        setIsEditing(false)
        showNotification("success", "Profile updated successfully!")
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setEditForm({
            ...editForm,
            [name]: value
        })
    }

    // Handle photo upload
    const handlePhotoUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        if (!validTypes.includes(file.type)) {
            showNotification("error", "Please upload a valid image (JPEG, PNG, WebP, or GIF)")
            return
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            showNotification("error", "Image size must be less than 2MB")
            return
        }

        setIsUploading(true)

        // Read file as base64
        const reader = new FileReader()
        reader.onload = (event) => {
            const base64Image = event.target.result
            
            // Update user with new avatar
            const updatedUser = { ...user, avatar: base64Image }
            localStorage.setItem("currentUser", JSON.stringify(updatedUser))
            setUser(updatedUser)
            setIsUploading(false)
            showNotification("success", "Profile photo updated successfully!")
            
            // Dispatch event for navbar to update
            window.dispatchEvent(new Event("profileUpdated"))
        }
        
        reader.onerror = () => {
            setIsUploading(false)
            showNotification("error", "Failed to upload image. Please try again.")
        }
        
        reader.readAsDataURL(file)
    }

    // Handle remove photo
    const handleRemovePhoto = () => {
        if (window.confirm("Are you sure you want to remove your profile photo?")) {
            const updatedUser = { ...user, avatar: null }
            localStorage.setItem("currentUser", JSON.stringify(updatedUser))
            setUser(updatedUser)
            showNotification("success", "Profile photo removed!")
            
            // Dispatch event for navbar to update
            window.dispatchEvent(new Event("profileUpdated"))
        }
    }

    // Trigger file input click
    const triggerFileInput = () => {
        fileInputRef.current.click()
    }

    if (!user) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>
    }

    return (
        <div className="min-h-screen py-8 bg-gray-50">
            <div className="container px-4 mx-auto">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left Side - User Info */}
                    <div className="lg:col-span-1">
                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <div className="mb-6 text-center">
                                <div className="relative inline-block">
                                    <img
                                        src={user.avatar || getDefaultAvatar()}
                                        alt="Profile"
                                        className="object-cover w-24 h-24 mx-auto border-4 border-gray-200 rounded-full"
                                    />
                                    {/* Photo upload overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center transition-opacity bg-black bg-opacity-0 hover:bg-opacity-30 rounded-full">
                                        <button
                                            onClick={triggerFileInput}
                                            disabled={isUploading}
                                            className="opacity-0 hover:opacity-100 p-2 bg-white rounded-full shadow-lg transition-all"
                                            title="Change photo"
                                        >
                                            {isUploading ? (
                                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Hidden file input */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    onChange={handlePhotoUpload}
                                    className="hidden"
                                />
                                
                                <h2 className="mt-4 text-xl font-bold text-gray-900">{user.name}</h2>
                                <p className="text-gray-600">{user.email}</p>
                                
                                {/* Photo action buttons */}
                                <div className="mt-3 flex justify-center gap-2">
                                    <button
                                        onClick={triggerFileInput}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        {user.avatar ? 'Change Photo' : 'Add Photo'}
                                    </button>
                                    {user.avatar && (
                                        <button
                                            onClick={handleRemovePhoto}
                                            className="text-sm text-red-600 hover:text-red-800"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                {isEditing ? (
                                    <form onSubmit={handleEditSubmit} className="space-y-3">
                                        <div>
                                            <label className="block text-sm text-gray-600">Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={editForm.name}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={editForm.email}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600">Phone</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={editForm.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600">Address</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={editForm.address}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                            />
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <button
                                                type="submit"
                                                className="flex-1 px-4 py-2 font-semibold text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                                            >
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(false)}
                                                className="flex-1 px-4 py-2 font-semibold text-white transition-colors bg-gray-500 rounded-lg hover:bg-gray-600"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Phone:</span>
                                            <span className="font-medium text-gray-900">{user.phone || "Not set"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Address:</span>
                                            <span className="font-medium text-gray-900">{user.address || "Not set"}</span>
                                        </div>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="w-full px-4 py-2 mt-2 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                                        >
                                            Edit Profile
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Content */}
                    <div className="lg:col-span-2">
                        {/* Tabs */}
                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`px-4 py-2 rounded-lg ${activeTab === "profile" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                            >
                                My Profile
                            </button>
                            <button
                                onClick={() => setActiveTab("orders")}
                                className={`px-4 py-2 rounded-lg ${activeTab === "orders" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                            >
                                My Orders
                            </button>
                        </div>

                        {/* Profile Tab */}
                        {activeTab === "profile" && (
                            <div className="p-6 bg-white rounded-lg shadow-md">
                                <h3 className="mb-4 text-lg font-bold">Profile Information</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Name</span>
                                        <span className="font-medium">{user.name}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Email</span>
                                        <span className="font-medium">{user.email}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Phone</span>
                                        <span className="font-medium">{user.phone || "Not set"}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Address</span>
                                        <span className="font-medium">{user.address || "Not set"}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Member Since</span>
                                        <span className="font-medium">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === "orders" && (
                            <div className="p-6 bg-white rounded-lg shadow-md">
                                <h3 className="mb-4 text-lg font-bold">My Orders</h3>
                                {orders.length > 0 ? (
                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <div key={order.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <span className="font-semibold text-lg">Order #{order.order_number || order.id}</span>
                                                        <p className="text-sm text-gray-500">
                                                            {new Date(order.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-3 py-1 text-xs rounded-full ${
                                                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                            order.status === 'paid' ? 'bg-green-100 text-green-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-gray-500">Items</p>
                                                        <p className="font-medium">{order.items?.length || 0} items</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">Subtotal</p>
                                                        <p className="font-medium">${order.subtotal?.toFixed(2)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">Shipping</p>
                                                        <p className="font-medium">${order.shipping_cost?.toFixed(2)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">Total</p>
                                                        <p className="font-bold text-red-600">${order.total?.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                                {order.tracking_number && (
                                                    <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                                                        <p className="text-blue-800">
                                                            <FaShippingFast className="inline mr-2" />
                                                            Tracking: {order.tracking_number}
                                                        </p>
                                                    </div>
                                                )}
                                                <div className="mt-3 flex gap-2">
                                                    <Link 
                                                        to={`/track-order?order=${order.order_number}`}
                                                        className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                                                    >
                                                        <FaEye /> View Details
                                                    </Link>
                                                    {order.tracking_number && (
                                                        <span className="flex items-center gap-1 px-3 py-1 text-sm text-green-600">
                                                            <FaCheckCircle /> Track Shipment
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <FaBox className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                                        <p className="mb-4">No orders yet</p>
                                        <Link to="/shop" className="text-red-600 hover:underline font-medium">Start Shopping</Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfile
