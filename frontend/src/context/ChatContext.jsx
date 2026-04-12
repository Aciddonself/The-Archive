import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { chatService } from "../lib/chatService"
import { useAuth } from "./AuthContext"

const ChatContext = createContext(null)

export const ChatProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  const [isChatConnected, setIsChatConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [lastMessage, setLastMessage] = useState(null)

  // Connect to chat when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      // Connect to realtime chat
      const connect = async () => {
        const connected = await chatService.connect(user.id)
        setIsChatConnected(connected)
        
        // Update online status
        if (connected) {
          await chatService.updateOnlineStatus(user.id, true)
        }
      }
      
      connect()
      
      // Set up message handlers
      const unsubscribeMessage = chatService.onMessage("new_message", (payload) => {
        setLastMessage(payload)
        setUnreadCount(prev => prev + 1)
      })
      
      const unsubscribeAdminReply = chatService.onMessage("admin_reply", (payload) => {
        setLastMessage(payload)
        setUnreadCount(prev => prev + 1)
      })
      
      // Set up connection handlers
      const unsubscribeConnection = chatService.onConnectionChange((connected) => {
        setIsChatConnected(connected)
      })
      
      // Set up status handlers
      const unsubscribeOnline = chatService.onStatusChange("online", (payload) => {
        setOnlineUsers(prev => [...prev.filter(u => u.userId !== payload.userId), payload])
      })
      
      const unsubscribeOffline = chatService.onStatusChange("offline", (payload) => {
        setOnlineUsers(prev => prev.filter(u => u.userId !== payload.userId))
      })
      
      return () => {
        unsubscribeMessage()
        unsubscribeAdminReply()
        unsubscribeConnection()
        unsubscribeOnline()
        unsubscribeOffline()
        chatService.disconnect()
      }
    }
  }, [isAuthenticated, user?.id])

  // Clear unread count when messages are viewed
  const clearUnreadCount = useCallback(() => {
    setUnreadCount(0)
  }, [])

  // Send message to admin
  const sendMessageToAdmin = useCallback(async (text) => {
    if (!user) return { success: false, error: "Not authenticated" }
    
    try {
      const result = await chatService.sendToAdmin({
        text,
        senderId: user.id,
        senderName: user.name || user.email,
        senderRole: user.role || "customer"
      })
      
      return { success: result.ok }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }, [user])

  // Send reply to user (admin only)
  const sendReplyToUser = useCallback(async (userId, text, senderName) => {
    try {
      const result = await chatService.sendToUser(userId, {
        text,
        senderName: senderName || "Support Team"
      })
      
      return { success: result.ok }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }, [])

  // Check if a user is online
  const isUserOnline = useCallback((userId) => {
    return onlineUsers.some(u => u.userId === userId)
  }, [onlineUsers])

  return (
    <ChatContext.Provider value={{
      isChatConnected,
      onlineUsers,
      unreadCount,
      lastMessage,
      clearUnreadCount,
      sendMessageToAdmin,
      sendReplyToUser,
      isUserOnline
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChat must be used within ChatProvider")
  }
  return context
}

export default ChatContext
