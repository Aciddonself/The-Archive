import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { FaUser, FaComments, FaPaperPlane, FaHeadset, FaCircle } from "react-icons/fa"
import { IoLogoWhatsapp } from "react-icons/io5"
import UserLayout from "../components/Layout/UserLayout"
import { useChat } from "../context/ChatContext"
import { useAuth } from "../context/AuthContext"

const Chat = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated } = useAuth()
  const { isChatConnected, sendMessageToAdmin, clearUnreadCount } = useChat()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [conversation, setConversation] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef(null)

  // Get user from localStorage directly to ensure we have it
  const getUser = () => {
    const userData = localStorage.getItem("currentUser")
    return userData ? JSON.parse(userData) : null
  }

  // Check if user is logged in and load conversation
  useEffect(() => {
    const currentUser = getUser()
    
    if (!currentUser) {
      // Not logged in, redirect to login
      navigate("/login", { state: { from: location } })
      return
    }

    const loadConversation = () => {
      try {
        const storedChats = JSON.parse(localStorage.getItem("chats") || "[]")
        
        // Find existing conversation with admin
        let adminChat = storedChats.find(chat => 
          chat.participants && 
          chat.participants.includes(currentUser.email) && 
          chat.participants.some(p => p.includes("admin") || p === "admin@aromomit.com")
        )
        
        if (adminChat) {
          setConversation(adminChat)
          setMessages(adminChat.messages || [])
        } else {
          // Create new conversation with main admin
          const mainAdminEmail = "admin@aromomit.com"
          const newChat = {
            id: `chat-${Date.now()}`,
            participants: [currentUser.email, mainAdminEmail],
            adminId: "admin-001",
            customerName: currentUser.name || currentUser.email,
            customerEmail: currentUser.email,
            messages: [],
            createdAt: new Date().toISOString(),
            lastMessage: "",
            lastMessageTime: null
          }
          
          storedChats.push(newChat)
          localStorage.setItem("chats", JSON.stringify(storedChats))
          setConversation(newChat)
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading conversation:", error)
        setIsLoading(false)
      }
    }
    
    loadConversation()
  }, [navigate, location])

  // Listen for real-time messages
  useEffect(() => {
    const currentUser = getUser()
    if (!currentUser || isLoading) return

    // Check for new messages periodically
    const interval = setInterval(() => {
      try {
        const storedChats = JSON.parse(localStorage.getItem("chats") || "[]")
        const chat = storedChats.find(c => 
          c.participants && c.participants.includes(currentUser.email)
        )
        if (chat && chat.messages) {
          setMessages(chat.messages)
        }
      } catch (error) {
        console.error("Error checking messages:", error)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [isLoading])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Clear unread count when component mounts
  useEffect(() => {
    if (!isLoading) {
      clearUnreadCount()
    }
  }, [isLoading, clearUnreadCount])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    const currentUser = getUser()
    if (!newMessage.trim() || !conversation || !currentUser) return
    
    const message = {
      id: Date.now(),
      text: newMessage,
      sender: currentUser.email,
      senderName: currentUser.name || currentUser.email,
      senderRole: currentUser.role || "customer",
      timestamp: new Date().toISOString()
    }
    
    // Update localStorage
    const storedChats = JSON.parse(localStorage.getItem("chats") || "[]")
    const updatedChats = storedChats.map(chat => {
      if (chat.id === conversation.id) {
        return {
          ...chat,
          messages: [...(chat.messages || []), message],
          lastMessage: message.text,
          lastMessageTime: message.timestamp
        }
      }
      return chat
    })
    
    localStorage.setItem("chats", JSON.stringify(updatedChats))
    setMessages([...messages, message])
    
    // Also send via realtime chat service if connected
    if (isChatConnected) {
      await sendMessageToAdmin(newMessage)
    }
    
    setNewMessage("")
  }

  // Show loading state
  if (isLoading) {
    return (
      <UserLayout>
        <div className="max-w-4xl px-4 py-8 mx-auto">
          <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-b-2 border-red-600 rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </UserLayout>
    )
  }

  const currentUser = getUser()
  if (!currentUser) {
    return null
  }

  return (
    <UserLayout>
      <div className="max-w-4xl px-4 py-8 mx-auto">
        <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-red-600 to-red-700">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 bg-white rounded-full">
                <FaHeadset className="text-red-600" />
                {/* Online indicator */}
                <FaCircle className={`absolute -bottom-0.5 -right-0.5 text-xs ${isChatConnected ? 'text-green-500' : 'text-gray-400'}`} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Customer Support</h2>
                <p className="text-sm text-red-100">
                  {isChatConnected ? 'Connected - Live' : 'Connecting...'}
                </p>
              </div>
            </div>
            <a
              href="https://wa.me/256700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              <IoLogoWhatsapp />
              WhatsApp
            </a>
          </div>
          
          {/* Messages */}
          <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length > 0 ? (
              messages.map((msg, index) => {
                const isOwn = msg.sender === currentUser.email
                return (
                  <div
                    key={msg.id || index}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[70%] ${isOwn ? "order-2" : "order-1"}`}>
                      <div className={`px-4 py-2 rounded-lg ${
                        isOwn 
                          ? "bg-red-600 text-white rounded-br-none" 
                          : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"
                      }`}>
                        <p>{msg.text}</p>
                      </div>
                      <p className={`text-xs text-gray-400 mt-1 ${isOwn ? "text-right" : "text-left"}`}>
                        {msg.senderName} • {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <FaComments className="mb-4 text-6xl text-gray-300" />
                <p className="text-lg">Start a conversation with our support team</p>
                <p className="text-sm text-gray-400">We're here to help!</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-4 py-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <FaPaperPlane />
              </button>
            </div>
          </form>
        </div>
      </div>
    </UserLayout>
  )
}

export default Chat
