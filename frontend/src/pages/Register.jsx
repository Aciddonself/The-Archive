import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useNotification } from "../App"
import man1 from "../assets/man1.webp"

const Register = () => {
    const navigate = useNavigate()
    const showNotification = useNotification()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
            showNotification("error", "Please fill in all fields")
            return
        }

        if (formData.password !== formData.confirmPassword) {
            showNotification("error", "Passwords do not match")
            return
        }

        if (formData.password.length < 6) {
            showNotification("error", "Password must be at least 6 characters")
            return
        }

        setIsLoading(true)

        try {
            // Check if email already exists
            const existingCustomers = JSON.parse(localStorage.getItem("customers") || "[]")
            const existingSubAdmins = JSON.parse(localStorage.getItem("subAdmins") || "[]")
            
            const emailExists = [...existingCustomers, ...existingSubAdmins].find(
                user => user.email === formData.email
            )
            
            if (emailExists) {
                showNotification("error", "Email already registered")
                setIsLoading(false)
                return
            }

            // Create new customer
            const newCustomer = {
                id: `cust-${Date.now()}`,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                role: "customer",
                createdAt: new Date().toISOString()
            }

            // Save to customers list
            const updatedCustomers = [...existingCustomers, newCustomer]
            localStorage.setItem("customers", JSON.stringify(updatedCustomers))

            // Store user info in localStorage for session
            const userData = {
                id: newCustomer.id,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                role: "customer",
                avatar: man1
            }
            localStorage.setItem("currentUser", JSON.stringify(userData))
            localStorage.setItem("isLoggedIn", "true")

            // Show success message
            showNotification("success", "Account created successfully! Welcome to Aromo-Mit Fashions.")
            
            // Trigger a custom event to update navbar
            window.dispatchEvent(new Event("userLoggedIn"))
            
            // Navigate immediately
            navigate("/")
        } catch (error) {
            console.error("Registration error:", error)
            showNotification("error", "Registration failed. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen">
            {/* Left Side - Register Form */}
            <div className="flex items-center justify-center w-full p-8 bg-white md:w-1/2">
                <div className="w-full max-w-md">
                    <h1 className="mb-2 text-3xl font-bold text-gray-900">Create Account</h1>
                    <p className="mb-8 text-gray-600">Join Aromo-Mit Fashions today</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="Enter your phone number"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="Create a password"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                placeholder="Confirm your password"
                            />
                        </div>

                        <div className="flex items-center">
                            <input type="checkbox" id="terms" className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                                I agree to the <a href="#" className="text-red-600 hover:underline">Terms & Conditions</a>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-colors ${
                                isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-900 hover:bg-red-600"
                            }`}
                        >
                            {isLoading ? "Creating account..." : "Create Account"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold text-red-600 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden w-1/2 md:block">
                <img
                    src={man1}
                    alt="Register"
                    className="object-cover w-full h-full"
                />
            </div>
        </div>
    )
}

export default Register