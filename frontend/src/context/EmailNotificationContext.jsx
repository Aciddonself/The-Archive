import { createContext, useContext, useState, useEffect } from "react"

const EmailNotificationContext = createContext(null)

export const EmailNotificationProvider = ({ children }) => {
  const [subscribedUsers, setSubscribedUsers] = useState(() => {
    const saved = localStorage.getItem("emailSubscriptions")
    return saved ? JSON.parse(saved) : []
  })
  
  const [notifications, setNotifications] = useState([])
  const [newProductAlert, setNewProductAlert] = useState(null)

  useEffect(() => {
    localStorage.setItem("emailSubscriptions", JSON.stringify(subscribedUsers))
  }, [subscribedUsers])

  // Subscribe user to email notifications
  const subscribeToEmails = (email, name) => {
    if (subscribedUsers.find(u => u.email === email)) {
      return { success: false, message: "Already subscribed" }
    }
    
    const newUser = {
      id: `sub-${Date.now()}`,
      email,
      name,
      subscribedAt: new Date().toISOString(),
      notifications: true
    }
    
    setSubscribedUsers([...subscribedUsers, newUser])
    return { success: true, message: "Subscribed successfully!" }
  }

  // Unsubscribe user from emails
  const unsubscribeFromEmails = (email) => {
    setSubscribedUsers(subscribedUsers.filter(u => u.email !== email))
    return { success: true, message: "Unsubscribed successfully!" }
  }

  // Check if user is subscribed
  const isSubscribed = (email) => {
    return subscribedUsers.some(u => u.email === email && u.notifications)
  }

  // Send new product notification (simulated)
  const notifyNewProduct = (product) => {
    // Create notification
    const notification = {
      id: `notif-${Date.now()}`,
      type: "new_product",
      product,
      message: `New product added: ${product.name}`,
      createdAt: new Date().toISOString(),
      read: false
    }

    setNotifications(prev => [notification, ...prev])
    setNewProductAlert(notification)

    // Simulate sending emails to subscribed users
    const subscribedEmails = subscribedUsers.filter(u => u.notifications)
    
    if (subscribedEmails.length > 0) {
      console.log("=== SIMULATED EMAIL NOTIFICATIONS ===")
      console.log(`Sending email to ${subscribedEmails.length} subscribers:`)
      subscribedEmails.forEach(user => {
        console.log(`- To: ${user.email}`)
        console.log(`  Subject: New Product Alert: ${product.name}`)
        console.log(`  Body: A new product "${product.name}" has been added to Aromo-Mit Fashions!`)
        console.log(`  Price: $${product.price}`)
        console.log(`  Category: ${product.category}`)
      })
      console.log("=====================================")
    }

    // Clear alert after 10 seconds
    setTimeout(() => {
      setNewProductAlert(null)
    }, 10000)

    return { 
      success: true, 
      message: `Notification sent to ${subscribedEmails.length} subscribers`,
      recipientCount: subscribedEmails.length 
    }
  }

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
  }

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([])
  }

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <EmailNotificationContext.Provider value={{
      subscribedUsers,
      notifications,
      newProductAlert,
      subscribeToEmails,
      unsubscribeFromEmails,
      isSubscribed,
      notifyNewProduct,
      markAsRead,
      clearNotifications,
      unreadCount
    }}>
      {children}
    </EmailNotificationContext.Provider>
  )
}

export const useEmailNotifications = () => {
  const context = useContext(EmailNotificationContext)
  if (!context) {
    throw new Error("useEmailNotifications must be used within EmailNotificationProvider")
  }
  return context
}
