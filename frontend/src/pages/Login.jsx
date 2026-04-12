import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useNotification } from "../App"
import { useAuth } from "../context/AuthContext"
import { signInWithGoogle, signInWithApple } from "../lib/insforge"

const Login = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const showNotification = useNotification()
    const { login, register } = useAuth()
    
    const [isOAuthLoading, setIsOAuthLoading] = useState(false)
    
    const [formData, setFormData] = useState({
        login: "",
        password: ""
    })
    const [errors, setErrors] = useState({
        login: "",
        password: ""
    })
    const [isLoading, setIsLoading] = useState(false)
    const [showRegister, setShowRegister] = useState(false)
    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    })
    const [registerErrors, setRegisterErrors] = useState({})

    const from = location.state?.from?.pathname || "/"

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
        // Clear error when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ""
            })
        }
    }

    const handleRegisterChange = (e) => {
        const { name, value } = e.target
        setRegisterData({
            ...registerData,
            [name]: value
        })
        // Clear error when user types
        if (registerErrors[name]) {
            setRegisterErrors({
                ...registerErrors,
                [name]: ""
            })
        }
    }

    const handleGoogleLogin = async () => {
        setIsOAuthLoading(true)
        try {
            await signInWithGoogle()
        } catch (error) {
            showNotification("error", "Failed to initiate Google login")
            setIsOAuthLoading(false)
        }
    }

    const handleAppleLogin = async () => {
        setIsOAuthLoading(true)
        try {
            await signInWithApple()
        } catch (error) {
            showNotification("error", "Failed to initiate Apple login")
            setIsOAuthLoading(false)
        }
    }

    const validateForm = () => {
        const newErrors = {}
        if (!formData.login.trim()) {
            newErrors.login = "Login is required."
        }
        if (!formData.password.trim()) {
            newErrors.password = "Password is required."
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const validateRegisterForm = () => {
        const newErrors = {}
        if (!registerData.name.trim()) {
            newErrors.name = "Name is required."
        }
        if (!registerData.email.trim()) {
            newErrors.email = "Email is required."
        }
        if (!registerData.phone.trim()) {
            newErrors.phone = "Phone is required."
        }
        if (!registerData.password.trim()) {
            newErrors.password = "Password is required."
        }
        if (!registerData.confirmPassword.trim()) {
            newErrors.confirmPassword = "Confirm password is required."
        }
        if (registerData.password !== registerData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match."
        }
        setRegisterErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        // Try to login with the login field (could be email or username)
        const result = login(formData.login, formData.password)

        if (result.success) {
            showNotification("success", "Login successful!")
            
            // Log user details
            console.log("=== USER LOGIN DETAILS ===")
            console.log("User:", result.user)
            console.log("Login Time:", new Date().toISOString())
            console.log("==========================")
            
            // Set isLoggedIn for Navbar compatibility
            localStorage.setItem("isLoggedIn", "true")
            
            // Trigger navbar update
            window.dispatchEvent(new Event("userLoggedIn"))
            
            // Redirect admins to admin panel
            if (result.user.role === "main_admin" || result.user.role === "sub_admin") {
                navigate("/admin", { replace: true })
            } else {
                navigate(from, { replace: true })
            }
        } else {
            showNotification("error", result.error || "Invalid login or password")
            setErrors({
                ...errors,
                login: "Invalid login or password",
                password: ""
            })
        }
        
        setIsLoading(false)
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        
        if (!validateRegisterForm()) {
            return
        }

        setIsLoading(true)

        // Try to register
        const regResult = register(registerData.name, registerData.email, registerData.password, registerData.phone)
        
        if (regResult.success) {
            showNotification("success", "Account created successfully!")
            // Set isLoggedIn for Navbar compatibility
            localStorage.setItem("isLoggedIn", "true")
            window.dispatchEvent(new Event("userLoggedIn"))
            navigate(from, { replace: true })
        } else {
            showNotification("error", regResult.error || "Registration failed")
        }
        
        setIsLoading(false)
    }

    return (
        <div className="bg-gradient-to-br from-teal-300 via-orange-300 to-blue-900 min-h-screen flex items-center justify-center px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 sm:p-8">
                {!showRegister ? (
                    <>
                        {/* Login Form */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="bg-blue-900 text-white rounded-full p-3 mb-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A4 4 0 0112 14a4 4 0 016.879 3.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-blue-900 text-center">welcome to Aromo-Mot Fashions.<br/>Please Login to continue</h2>
                        </div>

                        <form id="loginForm" onSubmit={handleSubmit} className="space-y-4" noValidate>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Login</label>
                                <input 
                                    type="text" 
                                    name="login"
                                    value={formData.login}
                                    onChange={handleChange}
                                    className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400" 
                                    placeholder="Enter your login" 
                                />
                                {errors.login && <p className="text-sm text-red-500 mt-1">{errors.login}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <input 
                                    type="password" 
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400" 
                                    placeholder="Enter your password" 
                                />
                                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition disabled:bg-orange-300"
                            >
                                {isLoading ? "Signing in..." : "Sign In"}
                            </button>
                        </form>

                        {/* OAuth Login Options */}
                        <div className="mt-4">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    disabled={isOAuthLoading}
                                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    Google
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAppleLogin}
                                    disabled={isOAuthLoading}
                                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-black text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                                    </svg>
                                    Apple
                                </button>
                            </div>
                        </div>

                        <p className="mt-4 text-center text-gray-600">
                            Don't have an account?{" "}
                            <button 
                                onClick={() => {
                                    setShowRegister(true)
                                    setErrors({})
                                }} 
                                className="font-semibold text-blue-700 hover:underline"
                            >
                                Sign up
                            </button>
                        </p>
                    </>
                ) : (
                    <>
                        {/* Register Form */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="bg-blue-900 text-white rounded-full p-3 mb-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-blue-900 text-center">Create your Account</h2>
                        </div>

                        <form onSubmit={handleRegister} className="space-y-4" noValidate>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input 
                                    type="text" 
                                    name="name"
                                    value={registerData.name}
                                    onChange={handleRegisterChange}
                                    className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400" 
                                    placeholder="Enter your full name" 
                                />
                                {registerErrors.name && <p className="text-sm text-red-500 mt-1">{registerErrors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={registerData.email}
                                    onChange={handleRegisterChange}
                                    className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400" 
                                    placeholder="Enter your email" 
                                />
                                {registerErrors.email && <p className="text-sm text-red-500 mt-1">{registerErrors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                <input 
                                    type="tel" 
                                    name="phone"
                                    value={registerData.phone}
                                    onChange={handleRegisterChange}
                                    className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400" 
                                    placeholder="+256 700 000 000" 
                                />
                                {registerErrors.phone && <p className="text-sm text-red-500 mt-1">{registerErrors.phone}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <input 
                                    type="password" 
                                    name="password"
                                    value={registerData.password}
                                    onChange={handleRegisterChange}
                                    className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400" 
                                    placeholder="Create a password" 
                                />
                                {registerErrors.password && <p className="text-sm text-red-500 mt-1">{registerErrors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                <input 
                                    type="password" 
                                    name="confirmPassword"
                                    value={registerData.confirmPassword}
                                    onChange={handleRegisterChange}
                                    className="w-full border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400" 
                                    placeholder="Confirm your password" 
                                />
                                {registerErrors.confirmPassword && <p className="text-sm text-red-500 mt-1">{registerErrors.confirmPassword}</p>}
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition disabled:bg-orange-300"
                            >
                                {isLoading ? "Creating account..." : "Sign Up"}
                            </button>
                        </form>

                        <p className="mt-4 text-center text-gray-600">
                            Already have an account?{" "}
                            <button 
                                onClick={() => {
                                    setShowRegister(false)
                                    setRegisterErrors({})
                                }} 
                                className="font-semibold text-blue-700 hover:underline"
                            >
                                Sign in
                            </button>
                        </p>
                    </>
                )}
            </div>
        </div>
    )
}

export default Login
