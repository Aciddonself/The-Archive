import { getRealtimeChat, getUserChannel, getAdminChannel, getConversationChannel, getOnlineStatusChannel } from "./insforge"

// Chat service for realtime messaging
class ChatService {
  constructor() {
    this.realtime = null
    this.subscriptions = new Map()
    this.messageHandlers = new Map()
    this.statusHandlers = new Map()
    this.connectionHandlers = []
    this.isConnected = false
    this.userId = null
  }

  // Initialize and connect to realtime
  async connect(userId) {
    this.userId = userId
    this.realtime = getRealtimeChat()
    
    // Set up connection event handlers
    this.realtime.realtime.on("connect", () => {
      this.isConnected = true
      this.notifyConnectionChange(true)
      console.log("Chat realtime connected")
    })

    this.realtime.realtime.on("disconnect", (reason) => {
      this.isConnected = false
      this.notifyConnectionChange(false)
      console.log("Chat realtime disconnected:", reason)
    })

    this.realtime.realtime.on("connect_error", (error) => {
      console.error("Chat connection error:", error.message)
    })

    try {
      await this.realtime.realtime.connect()
      
      // Subscribe to user's personal channel for receiving messages
      if (userId) {
        await this.subscribeToUserChannel(userId)
      }
      
      // Subscribe to admin channel for admins
      await this.subscribeToAdminChannel()
      
      // Subscribe to online status
      await this.subscribeToOnlineStatus()
      
      return true
    } catch (error) {
      console.error("Failed to connect to chat:", error)
      return false
    }
  }

  // Subscribe to user channel for receiving messages
  async subscribeToUserChannel(userId) {
    const channel = getUserChannel(userId)
    
    if (this.subscriptions.has(channel)) {
      return this.subscriptions.get(channel)
    }

    const response = await this.realtime.realtime.subscribe(channel)
    
    if (response.ok) {
      this.subscriptions.set(channel, response)
      
      // Listen for new messages
      this.realtime.realtime.on("new_message", (payload) => {
        this.handleNewMessage(payload, "user")
      })
      
      // Listen for admin reply notifications
      this.realtime.realtime.on("admin_reply", (payload) => {
        this.handleAdminReply(payload)
      })
    }
    
    return response
  }

  // Subscribe to admin channel
  async subscribeToAdminChannel() {
    const channel = getAdminChannel()
    
    if (this.subscriptions.has(channel)) {
      return this.subscriptions.get(channel)
    }

    const response = await this.realtime.realtime.subscribe(channel)
    
    if (response.ok) {
      this.subscriptions.set(channel, response)
      
      // Listen for new customer messages
      this.realtime.realtime.on("customer_message", (payload) => {
        this.handleNewMessage(payload, "admin")
      })
    }
    
    return response
  }

  // Subscribe to online status channel
  async subscribeToOnlineStatus() {
    const channel = getOnlineStatusChannel()
    
    if (this.subscriptions.has(channel)) {
      return this.subscriptions.get(channel)
    }

    const response = await this.realtime.realtime.subscribe(channel)
    
    if (response.ok) {
      this.subscriptions.set(channel, response)
      
      // Listen for online status changes
      this.realtime.realtime.on("user_online", (payload) => {
        this.handleStatusChange(payload, "online")
      })
      
      this.realtime.realtime.on("user_offline", (payload) => {
        this.handleStatusChange(payload, "offline")
      })
    }
    
    return response
  }

  // Handle new message received
  handleNewMessage(payload, context) {
    const handlers = this.messageHandlers.get("new_message") || []
    handlers.forEach(handler => handler(payload))
  }

  // Handle admin reply notification
  handleAdminReply(payload) {
    const handlers = this.messageHandlers.get("admin_reply") || []
    handlers.forEach(handler => handler(payload))
    
    // Also trigger browser notification if permitted
    this.showBrowserNotification("New message from support", payload.text || "You have a new message")
  }

  // Handle online/offline status change
  handleStatusChange(payload, status) {
    const handlers = this.statusHandlers.get(status) || []
    handlers.forEach(handler => handler(payload))
  }

  // Show browser notification
  showBrowserNotification(title, body) {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/favicon.ico"
      })
    }
  }

  // Request notification permission
  async requestNotificationPermission() {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission()
    }
  }

  // Send a message to a conversation
  async sendMessage(conversationId, message) {
    const channel = getConversationChannel(conversationId)
    
    // First subscribe to the conversation channel
    if (!this.subscriptions.has(channel)) {
      const response = await this.realtime.realtime.subscribe(channel)
      if (!response.ok) {
        console.error("Failed to subscribe to conversation:", response.error)
        return response
      }
    }
    
    // Publish the message
    return await this.realtime.realtime.publish(channel, "new_message", {
      ...message,
      timestamp: new Date().toISOString()
    })
  }

  // Send message to admin (from customer)
  async sendToAdmin(message) {
    await this.requestNotificationPermission()
    
    return await this.realtime.realtime.publish(getAdminChannel(), "customer_message", {
      ...message,
      timestamp: new Date().toISOString()
    })
  }

  // Send reply to user (from admin)
  async sendToUser(userId, message) {
    await this.requestNotificationPermission()
    
    const channel = getUserChannel(userId)
    
    // First subscribe to the user's channel
    if (!this.subscriptions.has(channel)) {
      const response = await this.realtime.realtime.subscribe(channel)
      if (!response.ok) {
        console.error("Failed to subscribe to user channel:", response.error)
        return response
      }
    }
    
    // Publish the admin reply
    return await this.realtime.realtime.publish(channel, "admin_reply", {
      ...message,
      timestamp: new Date().toISOString()
    })
  }

  // Update online status
  async updateOnlineStatus(userId, isOnline) {
    const channel = getOnlineStatusChannel()
    
    if (!this.subscriptions.has(channel)) {
      await this.realtime.realtime.subscribe(channel)
    }
    
    const event = isOnline ? "user_online" : "user_offline"
    
    return await this.realtime.realtime.publish(channel, event, {
      userId,
      status: isOnline ? "online" : "offline",
      timestamp: new Date().toISOString()
    })
  }

  // Check if user is online (for display)
  async getOnlineUsers() {
    // This would typically be stored in a database
    // For now, we track through realtime presence
    return []
  }

  // Register message handler
  onMessage(event, handler) {
    if (!this.messageHandlers.has(event)) {
      this.messageHandlers.set(event, [])
    }
    this.messageHandlers.get(event).push(handler)
    
    // Return unsubscribe function
    return () => {
      const handlers = this.messageHandlers.get(event)
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  // Register status change handler
  onStatusChange(status, handler) {
    if (!this.statusHandlers.has(status)) {
      this.statusHandlers.set(status, [])
    }
    this.statusHandlers.get(status).push(handler)
    
    return () => {
      const handlers = this.statusHandlers.get(status)
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  // Register connection change handler
  onConnectionChange(handler) {
    this.connectionHandlers.push(handler)
    
    return () => {
      const index = this.connectionHandlers.indexOf(handler)
      if (index > -1) {
        this.connectionHandlers.splice(index, 1)
      }
    }
  }

  // Notify connection change handlers
  notifyConnectionChange(isConnected) {
    this.connectionHandlers.forEach(handler => handler(isConnected))
  }

  // Disconnect from realtime
  disconnect() {
    if (this.realtime && this.realtime.realtime) {
      // Update status to offline before disconnecting
      if (this.userId) {
        this.updateOnlineStatus(this.userId, false)
      }
      
      this.realtime.realtime.disconnect()
    }
    this.subscriptions.clear()
    this.messageHandlers.clear()
    this.statusHandlers.clear()
    this.isConnected = false
  }
}

// Export singleton instance
export const chatService = new ChatService()

export default chatService
