import { createContext, useContext, useState, useEffect } from "react"
import { insforge } from "../lib/insforge"

const AuthContext = createContext(null)

// Main admin credentials (hardcoded for security)
const MAIN_ADMIN = {
  email: "admin@aromomit.com",
  password: "admin123",
  name: "Main Admin",
  role: "main_admin"
}

export const AuthProvider = ({ children }) => {
  // Check localStorage synchronously on initialization
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser")
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("currentUser") !== null
  })
  const [insforgeUser, setInsforgeUser] = useState(null)
  const [subAdmins, setSubAdmins] = useState(() => {
    const saved = localStorage.getItem("subAdmins")
    return saved ? JSON.parse(saved) : []
  })
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem("customers")
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    // Check for existing InsForge session
    const checkInsforgeSession = async () => {
      try {
        const { data: { session }, error } = await insforge.auth.getSession()
        if (session) {
          setInsforgeUser(session.user)
        }
      } catch (err) {
        console.log("No active InsForge session")
      }
    }
    
    checkInsforgeSession()
    
    // Check for existing session
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }
    localStorage.setItem("subAdmins", JSON.stringify(subAdmins))
  }, [subAdmins])

  const login = (email, password) => {
    // Check main admin
    if (email === MAIN_ADMIN.email && password === MAIN_ADMIN.password) {
      const userData = { ...MAIN_ADMIN, id: "admin-001" }
      setUser(userData)
      setIsAuthenticated(true)
      localStorage.setItem("currentUser", JSON.stringify(userData))
      return { success: true, user: userData }
    }

    // Check sub-admins
    const subAdmin = subAdmins.find(admin => admin.email === email && admin.password === password)
    if (subAdmin) {
      setUser(subAdmin)
      setIsAuthenticated(true)
      localStorage.setItem("currentUser", JSON.stringify(subAdmin))
      return { success: true, user: subAdmin }
    }

    // Check customers
    const customer = customers.find(c => c.email === email && c.password === password)
    if (customer) {
      setUser(customer)
      setIsAuthenticated(true)
      localStorage.setItem("currentUser", JSON.stringify(customer))
      return { success: true, user: customer }
    }

    return { success: false, error: "Invalid email or password" }
  }

  const loginWithEmail = async (email, password) => {
    try {
      const { data, error } = await insforge.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      if (data?.user) {
        const userData = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.email.split('@')[0],
          role: "customer",
          provider: "insforge"
        }
        setUser(userData)
        setInsforgeUser(data.user)
        setIsAuthenticated(true)
        localStorage.setItem("currentUser", JSON.stringify(userData))
        return { success: true, user: userData }
      }
      
      return { success: false, error: "Login failed" }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const registerWithEmail = async (name, email, password, phone) => {
    try {
      const { data, error } = await insforge.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone
          }
        }
      })
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      if (data?.user) {
        const userData = {
          id: data.user.id,
          email: data.user.email,
          name: name,
          phone: phone,
          role: "customer",
          provider: "insforge"
        }
        setUser(userData)
        setInsforgeUser(data.user)
        setIsAuthenticated(true)
        localStorage.setItem("currentUser", JSON.stringify(userData))
        return { success: true, user: userData }
      }
      
      return { success: true, message: "Registration successful! Please check your email to verify." }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const handleOAuthCallback = async (code) => {
    try {
      const { exchangeOAuthCode } = await import("../lib/insforge")
      const response = await exchangeOAuthCode(code)
      
      if (response?.user) {
        const userData = {
          id: response.user.id,
          email: response.user.email,
          name: response.user.email.split('@')[0],
          role: "customer",
          provider: "oauth",
          providers: response.user.providers
        }
        setUser(userData)
        setInsforgeUser(response.user)
        setIsAuthenticated(true)
        localStorage.setItem("currentUser", JSON.stringify(userData))
        return { success: true, user: userData }
      }
      
      return { success: false, error: "OAuth authentication failed" }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const register = (name, email, password, phone) => {
    // Check if email already exists
    if (customers.find(c => c.email === email) || subAdmins.find(a => a.email === email)) {
      return { success: false, error: "Email already registered" }
    }

    const newCustomer = {
      id: `cust-${Date.now()}`,
      name,
      email,
      password,
      phone,
      role: "customer",
      createdAt: new Date().toISOString()
    }

    const updatedCustomers = [...customers, newCustomer]
    setCustomers(updatedCustomers)
    localStorage.setItem("customers", JSON.stringify(updatedCustomers))

    // Auto-login after registration
    setUser(newCustomer)
    setIsAuthenticated(true)
    localStorage.setItem("currentUser", JSON.stringify(newCustomer))

    return { success: true, user: newCustomer }
  }

  const logout = async () => {
    // Sign out from InsForge if session exists
    if (insforgeUser) {
      try {
        await insforge.auth.signOut()
      } catch (err) {
        console.log("InsForge logout error:", err)
      }
    }
    
    setUser(null)
    setInsforgeUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("currentUser")
  }

  const addSubAdmin = (name, email, password, permissions) => {
    if (subAdmins.find(admin => admin.email === email)) {
      return { success: false, error: "Email already exists" }
    }

    const newSubAdmin = {
      id: `admin-${Date.now()}`,
      name,
      email,
      password,
      role: "sub_admin",
      permissions,
      createdAt: new Date().toISOString(),
      createdBy: user?.email
    }

    const updatedSubAdmins = [...subAdmins, newSubAdmin]
    setSubAdmins(updatedSubAdmins)
    localStorage.setItem("subAdmins", JSON.stringify(updatedSubAdmins))

    return { success: true, admin: newSubAdmin }
  }

  const removeSubAdmin = (id) => {
    const updated = subAdmins.filter(admin => admin.id !== id)
    setSubAdmins(updated)
    localStorage.setItem("subAdmins", JSON.stringify(updated))
  }

  const isMainAdmin = () => user?.role === "main_admin"
  const isAdmin = () => user?.role === "main_admin" || user?.role === "sub_admin"

  const hasPermission = (permission) => {
    if (isMainAdmin()) return true
    if (user?.role !== "sub_admin") return false
    return user?.permissions?.includes(permission)
  }

  return (
    <AuthContext.Provider value={{
      user,
      insforgeUser,
      isAuthenticated,
      login,
      loginWithEmail,
      registerWithEmail,
      handleOAuthCallback,
      logout,
      register,
      addSubAdmin,
      removeSubAdmin,
      isMainAdmin,
      isAdmin,
      hasPermission,
      subAdmins,
      customers
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
