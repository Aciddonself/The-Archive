import { useState, useEffect, useRef } from "react"
import { useAuth } from "../../context/AuthContext"
import { useChat } from "../../context/ChatContext"
import { FaUser, FaComments, FaSearch, FaPaperPlane, FaTimes, FaCircle } from "react-icons/fa"

const Chat = () => {
  const { user, customers, subAdmins } = useAuth()
  const { isChatConnected, onlineUsers, isUserOnline, sendReplyToUser } = useChat()
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const messagesEndRef = useRef(null)

  // Load chat data from localStorage
  useEffect(() => {
    const loadChats = () => {
      try {
        const storedChats = JSON.parse(localStorage.getItem("chats") || "[]")
        
        if (user?.role === "main_admin" || user?.role === "sub_admin") {
          // Admin sees all conversations
          const adminConversations = storedChats.filter(chat => 
            chat.adminId === user.id || chat.participants.includes(user.email)
          )
          setConversations(adminConversations)
        } else {
          // Regular user sees their conversations
          const userConversations = storedChats.filter(chat => 
            chat.participants && chat.participants.includes(user?.email)
          )
          setConversations(userConversations)
        }
      } catch (error) {
        console.error("Error loading chats:", error)
      }
    }
    
    loadChats()
    
    // Refresh periodically
    const interval = setInterval(loadChats, 3000)
    return () => clearInterval(interval)
  }, [user])

  // Load messages for selected conversation
  useEffect(() => {
    if (selectedConversation) {
      const storedChats = JSON.parse(localStorage.getItem("chats") || "[]")
      const chat = storedChats.find(c => c.id === selectedConversation.id)
      if (chat) {
        setMessages(chat.messages || [])
      }
    }
  }, [selectedConversation])

  // Listen for new messages in real-time
  useEffect(() => {
    if (!selectedConversation || !user) return

    const checkNewMessages = () => {
      const storedChats = JSON.parse(localStorage.getItem("chats") || "[]")
      const chat = storedChats.find(c => c.id === selectedConversation.id)
      if (chat && chat.messages) {
        setMessages(chat.messages)
      }
    }

    const interval = setInterval(checkNewMessages, 2000)
    return () => clearInterval(interval)
  }, [selectedConversation, user])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const getConversationName = (conversation) => {
    if (!user) return "Unknown"
    const otherParticipants = conversation.participants ? conversation.participants.filter(p => p !== user.email) : []
    if (otherParticipants.length > 0) {
      // Check if it's a customer
      const customer = customers.find(c => c.email === otherParticipants[0])
      if (customer) return customer.name
      
      const subAdmin = subAdmins.find(s => s.email === otherParticipants[0])
      if (subAdmin) return subAdmin.name
      
      return conversation.customerName || otherParticipants[0]
    }
    return conversation.customerName || "Unknown"
  }

  const getConversationRole = (conversation) => {
    if (!user) return "User"
    const otherParticipants = conversation.participants ? conversation.participants.filter(p => p !== user.email) : []
    if (otherParticipants.length > 0) {
      const customer = customers.find(c => c.email === otherParticipants[0])
      if (customer) return "Customer"
      
      const subAdmin = subAdmins.find(s => s.email === otherParticipants[0])
      if (subAdmin) return "Sub-Admin"
    }
    return "User"
  }

  // Check if a user is online
  const checkUserOnlineStatus = (conversation) => {
    // Get the customer email from conversation
    const customerEmail = conversation.customerEmail || conversation.participants?.find(p => !p.includes("admin"))
    if (customerEmail) {
      // Check against known online users
      return isUserOnline(customerEmail)
    }
    return false
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!newMessage.trim() || !selectedConversation) return
    
    const message = {
      id: Date.now(),
      text: newMessage,
      sender: user?.email,
      senderName: user?.name || user?.email,
      senderRole: user?.role,
      timestamp: new Date().toISOString()
    }
    
    // Update localStorage
    const storedChats = JSON.parse(localStorage.getItem("chats") || "[]")
    const updatedChats = storedChats.map(chat => {
      if (chat.id === selectedConversation.id) {
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
    
    // Send via realtime if connected (for notifications)
    if (isChatConnected && selectedConversation.customerEmail) {
      await sendReplyToUser(
        selectedConversation.customerEmail,
        newMessage,
        user?.name || "Support Team"
      )
    }
    
    setNewMessage("")
  }

  const startNewConversation = (customerEmail, customerName) => {
    const storedChats = JSON.parse(localStorage.getItem("chats") || "[]")
    
    // Check if conversation already exists
    const existingChat = storedChats.find(chat => 
      chat.participants && chat.participants.includes(user?.email) && chat.participants.includes(customerEmail)
    )
    
    if (existingChat) {
      setSelectedConversation(existingChat)
      return
    }
    
    // Create new conversation
    const newChat = {
      id: `chat-${Date.now()}`,
      participants: [user?.email, customerEmail],
      adminId: user?.role === "main_admin" || user?.role === "sub_admin" ? user?.id : null,
      customerName: customerName,
      customerEmail: customerEmail,
      messages: [],
      createdAt: new Date().toISOString(),
      lastMessage: "",
      lastMessageTime: null
    }
    
    const updatedChats = [...storedChats, newChat]
    localStorage.setItem("chats", JSON.stringify(updatedChats))
    setConversations([...conversations, newChat])
    setSelectedConversation(newChat)
  }

  const filteredConversations = conversations.filter(conv => {
    const name = getConversationName(conv).toLowerCase()
    return name.includes(searchTerm.toLowerCase())
  })

  const filteredCustomers = customers.filter(c => 
    c.role === "customer" && 
    c.email !== user?.email &&
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const isAdmin = user?.role === "main_admin" || user?.role === "sub_admin"

  return (
    <div className="flex h-[calc(100vh-180px)] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Conversations List */}
      <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-1/3 border-r border-gray-100`}>
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Messages</h2>
          <div className="relative">
            <FaSearch className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          {/* Connection Status */}
          <div className="mt-2 flex items-center gap-2 text-sm">
            <FaCircle className={`text-xs ${isChatConnected ? 'text-green-500' : 'text-gray-400'}`} />
            <span className={isChatConnected ? 'text-green-600' : 'text-gray-500'}>
              {isChatConnected ? 'Live' : 'Connecting...'}
            </span>
          </div>
        </div>
        
        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            filteredConversations.map(conv => {
              const isUserOnlineNow = checkUserOnlineStatus(conv)
              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation?.id === conv.id ? "bg-red-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
                        <FaUser className="text-red-600" />
                      </div>
                      {/* Online indicator */}
                      <FaCircle 
                        className={`absolute -bottom-0.5 -right-0.5 text-xs ${isUserOnlineNow ? 'text-green-500' : 'text-gray-400'}`} 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-800 truncate">
                          {getConversationName(conv)}
                        </p>
                        <span className="text-xs text-gray-500">
                          {conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {conv.lastMessage || "No messages yet"}
                      </p>
                      <span className="text-xs text-gray-400">
                        {getConversationRole(conv)} {isUserOnlineNow && '• Online'}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="p-8 text-center text-gray-500">
              <FaComments className="mx-auto text-4xl text-gray-300 mb-4" />
              <p>No conversations yet</p>
            </div>
          )}
        </div>
        
        {/* Start new conversation (for admin) */}
        {isAdmin && (
          <div className="p-4 border-t border-gray-100">
            <p className="text-sm text-gray-600 mb-2">Start new conversation:</p>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {filteredCustomers.slice(0, 5).map(customer => (
                <button
                  key={customer.id}
                  onClick={() => startNewConversation(customer.email, customer.name)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="font-medium">{customer.name}</span>
                  <span className="text-gray-400 ml-2">- Customer</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Chat Area */}
      {selectedConversation ? (
        <div className="flex flex-col flex-1">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSelectedConversation(null)}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <FaTimes />
              </button>
              <div className="relative">
                <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
                  <FaUser className="text-red-600" />
                </div>
                <FaCircle 
                  className={`absolute -bottom-0.5 -right-0.5 text-xs ${checkUserOnlineStatus(selectedConversation) ? 'text-green-500' : 'text-gray-400'}`} 
                />
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  {getConversationName(selectedConversation)}
                </p>
                <p className="text-sm text-gray-500">
                  {getConversationRole(selectedConversation)} • {checkUserOnlineStatus(selectedConversation) ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length > 0 ? (
              messages.map((msg, index) => {
                const isOwn = msg.sender === user?.email
                return (
                  <div
                    key={msg.id || index}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[70%] ${isOwn ? "order-2" : "order-1"}`}>
                      <div className={`px-4 py-2 rounded-lg ${
                        isOwn 
                          ? "bg-red-600 text-white rounded-br-none" 
                          : "bg-gray-100 text-gray-800 rounded-bl-none"
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
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>No messages yet. Start the conversation!</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100">
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
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <FaPaperPlane />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="hidden md:flex flex-col flex-1 items-center justify-center text-gray-500">
          <FaComments className="text-6xl text-gray-300 mb-4" />
          <p className="text-lg">Select a conversation to start chatting</p>
        </div>
      )}
    </div>
  )
}

export default Chat
