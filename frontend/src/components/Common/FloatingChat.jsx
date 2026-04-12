import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaComment, FaTimes, FaPaperPlane, FaRobot, FaUser, FaCheck } from "react-icons/fa"
import { IoLogoWhatsapp } from "react-icons/io5"
import { useNotification } from "../../App"

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [user, setUser] = useState(null)
  const [supportRequested, setSupportRequested] = useState(false)
  const navigate = useNavigate()
  const showNotification = useNotification()

  useEffect(() => {
    const checkLogin = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true" || localStorage.getItem("currentUser") !== null
      setIsLoggedIn(loggedIn)
      const userData = localStorage.getItem("currentUser")
      if (userData) {
        setUser(JSON.parse(userData))
      }
    }
    checkLogin()
    
    window.addEventListener("userLoggedIn", checkLogin)
    window.addEventListener("userLoggedOut", checkLogin)
    
    return () => {
      window.removeEventListener("userLoggedIn", checkLogin)
      window.removeEventListener("userLoggedOut", checkLogin)
    }
  }, [])

  // Initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: "Hello! I'm the Aromo-Mit AI Assistant. I can help you with:\n• Product information\n• Order status\n• Shipping details\n• Returns & exchanges\n\nHow can I help you today?",
          sender: "bot",
          timestamp: new Date().toISOString()
        }
      ])
    }
  }, [isOpen])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      text: newMessage,
      sender: "user",
      timestamp: new Date().toISOString()
    }

    setMessages([...messages, userMessage])
    setNewMessage("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false)
      const botResponse = getBotResponse(newMessage)
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: botResponse.text,
        sender: "bot",
        timestamp: new Date().toISOString(),
        needsAdmin: botResponse.needsAdmin
      }])
    }, 1500)
  }

  const getBotResponse = (message) => {
    const lowerMessage = message.toLowerCase()
    
    // Product related questions
    if (lowerMessage.includes("product") || lowerMessage.includes("shop") || lowerMessage.includes("buy") || lowerMessage.includes("catalog")) {
      return {
        text: "You can browse our products by visiting our Shop page! We have Men's wear, Women's wear, Kids collection, African beads, and more. Use the navigation menu to explore our collection.",
        needsAdmin: false
      }
    }
    
    // Price related
    if (lowerMessage.includes("price") || lowerMessage.includes("cost") || lowerMessage.includes("how much")) {
      return {
        text: "Our products have varying prices depending on the item. You can view prices on each product page in our shop. Would you like me to help you find something specific?",
        needsAdmin: false
      }
    }
    
    // Order status
    if (lowerMessage.includes("order") || lowerMessage.includes("status") || lowerMessage.includes("track")) {
      return {
        text: "To check your order status, please log in to your account and go to 'My Orders' in your profile. If you haven't placed an order yet, you can browse our shop to make your first purchase!",
        needsAdmin: false
      }
    }
    
    // Shipping
    if (lowerMessage.includes("shipping") || lowerMessage.includes("delivery") || lowerMessage.includes("ship") || lowerMessage.includes("deliver")) {
      return {
        text: "We offer shipping across East Africa and internationally! Delivery times vary by location. For specific shipping inquiries, I'd be happy to connect you with our support team.",
        needsAdmin: true
      }
    }
    
    // Returns
    if (lowerMessage.includes("return") || lowerMessage.includes("exchange") || lowerMessage.includes("refund")) {
      return {
        text: "We accept returns and exchanges within 7 days of delivery. Items must be unworn and in original condition. Would you like me to connect you with our support team for a specific return request?",
        needsAdmin: true
      }
    }
    
    // Size guide
    if (lowerMessage.includes("size") || lowerMessage.includes("sizing")) {
      return {
        text: "We have a size guide available on each product page. Sizes typically run as: S (Small), M (Medium), L (Large), XL (Extra Large). If you're unsure, I'd recommend sizing up for a comfortable fit!",
        needsAdmin: false
      }
    }
    
    // Contact human/admin
    if (lowerMessage.includes("human") || lowerMessage.includes("talk to") || lowerMessage.includes("speak") || lowerMessage.includes("manager") || lowerMessage.includes("support")) {
      return {
        text: "I'll connect you with our support team right away! Please click the 'Chat with Human Support' button below to speak with a human agent. They're available Mon-Sat, 9am-6pm EAT.",
        needsAdmin: true
      }
    }
    
    // Payment
    if (lowerMessage.includes("payment") || lowerMessage.includes("pay") || lowerMessage.includes("card") || lowerMessage.includes("mobile money")) {
      return {
        text: "We accept various payment methods including credit/debit cards and mobile money. During checkout, you'll be redirected to a secure payment page.",
        needsAdmin: false
      }
    }
    
    // Thank you
    if (lowerMessage.includes("thank") || lowerMessage.includes("thanks")) {
      return {
        text: "You're welcome! Is there anything else I can help you with?",
        needsAdmin: false
      }
    }
    
    // Greeting
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return {
        text: "Hello! How can I help you today? You can ask me about products, orders, shipping, or anything else about Aromo-Mit Fashions!",
        needsAdmin: false
      }
    }
    
    // Default response
    return {
      text: "That's a great question! Let me connect you with our support team who can help you better. Please click the 'Chat with Human Support' button below to speak with a human agent.",
      needsAdmin: true
    }
  }

  // Create support request notification for admin and navigate to chat
  const handleChatWithSupport = () => {
    if (!user) {
      showNotification("error", "Please login to chat with support")
      navigate("/login")
      return
    }
    
    // Create support request
    const supportRequests = JSON.parse(localStorage.getItem("supportRequests") || "[]")
    const newRequest = {
      id: `support-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      message: "Customer needs human support",
      status: "pending",
      createdAt: new Date().toISOString()
    }
    supportRequests.unshift(newRequest)
    localStorage.setItem("supportRequests", JSON.stringify(supportRequests))
    
    // Create or find conversation with admin
    const storedChats = JSON.parse(localStorage.getItem("chats") || "[]")
    let adminChat = storedChats.find(chat => 
      chat.participants && 
      chat.participants.includes(user.email) && 
      chat.participants.some(p => p.includes("admin"))
    )
    
    if (!adminChat) {
      // Create new conversation
      adminChat = {
        id: `chat-${Date.now()}`,
        participants: [user.email, "admin@aromomit.com"],
        adminId: "admin-001",
        customerName: user.name,
        customerEmail: user.email,
        messages: [],
        createdAt: new Date().toISOString(),
        lastMessage: "Customer requested human support",
        lastMessageTime: new Date().toISOString()
      }
      storedChats.push(adminChat)
      localStorage.setItem("chats", JSON.stringify(storedChats))
    }
    
    // Dispatch event for admin to see notification
    window.dispatchEvent(new Event("supportRequestCreated"))
    
    // Navigate to chat
    setIsOpen(false)
    navigate("/chat")
    
    showNotification("success", "Connected to support! Starting a conversation...")
  }

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-50 flex items-center justify-center w-16 h-16 text-white transition-all bg-red-600 rounded-full shadow-lg bottom-6 right-6 hover:bg-red-700 animate-bounce"
        style={{ boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)' }}
      >
        {isOpen ? <FaTimes className="text-2xl" /> : <FaComment className="text-2xl" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed z-50 overflow-hidden bg-white border border-gray-200 shadow-2xl bottom-24 right-6 w-80 md:w-96 rounded-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-600 to-red-700">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full">
                <FaRobot className="text-xl text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Aromo-Mit Assistant</h3>
                <p className="text-xs text-red-100">AI Powered Help</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 text-white transition-colors rounded-lg hover:bg-red-800"
            >
              <FaTimes />
            </button>
          </div>

          {/* Messages */}
          <div className="p-4 space-y-3 overflow-y-auto h-80 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] ${msg.sender === "user" ? "order-2" : "order-1"}`}>
                  <div className={`px-4 py-2 rounded-lg ${
                    msg.sender === "user" 
                      ? "bg-red-600 text-white rounded-br-none" 
                      : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"
                  }`}>
                    <p className="text-sm whitespace-pre-line">{msg.text}</p>
                  </div>
                  <div className={`flex items-center gap-1 mt-1 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.sender === "bot" && <FaRobot className="text-xs text-gray-400" />}
                    {msg.sender === "user" && <FaUser className="text-xs text-gray-400" />}
                    <span className="text-xs text-gray-400">
                      {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg rounded-bl-none shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Support Button */}
          {messages.some(m => m.needsAdmin) && !supportRequested && (
            <div className="px-4 pb-2">
              <button
                onClick={handleChatWithSupport}
                className="flex items-center justify-center w-full gap-2 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <FaUser />
                Chat with Human Support
              </button>
              <a
                href="https://wa.me/256700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full gap-2 py-2 mt-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
              >
                <IoLogoWhatsapp />
                Chat on WhatsApp
              </a>
            </div>
          )}

          {supportRequested && (
            <div className="px-4 pb-2">
              <div className="flex items-center justify-center w-full gap-2 py-2 text-white bg-green-600 rounded-lg">
                <FaCheck />
                Connected to Support
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-3 py-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <FaPaperPlane />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

export default FloatingChat
