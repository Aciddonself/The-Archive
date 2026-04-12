import { createClient } from "@insforge/sdk"

const INSFORGE_URL = import.meta.env.VITE_INSFORGE_URL || "https://envjj7hu.us-east.insforge.app"
const INSFORGE_API_KEY = import.meta.env.VITE_INSFORGE_API_KEY || ""

export const db = createClient({
  baseURL: INSFORGE_URL,
  apiKey: INSFORGE_API_KEY
})

// Generate unique order number
export const generateOrderNumber = () => {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const random = Math.random().toString(36).substr(2, 6).toUpperCase()
  return `AMF-${year}${month}-${random}`
}

// Products CRUD
export const productsService = {
  async getAll(filters = {}) {
    let query = db.from('products').select('*').eq('is_active', true)
    
    if (filters.category) query = query.eq('category', filters.category)
    if (filters.gender) query = query.eq('gender', filters.gender)
    if (filters.minPrice) query = query.gte('price', filters.minPrice)
    if (filters.maxPrice) query = query.lte('price', filters.maxPrice)
    if (filters.search) query = query.ilike('name', `%${filters.search}%`)
    
    const { data, error } = await query.order('created_at', { ascending: false })
    return { data, error }
  },

  async getById(id) {
    const { data, error } = await db.from('products').select('*').eq('id', id).single()
    return { data, error }
  },

  async create(product) {
    const { data, error } = await db.from('products').insert(product).select().single()
    return { data, error }
  },

  async update(id, updates) {
    const { data, error } = await db.from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async delete(id) {
    const { data, error } = await db.from('products')
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async updateStock(id, quantity) {
    const { data, error } = await db.from('products')
      .update({ 
        stock_quantity: db.raw('stock_quantity - ?', [quantity]),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async getLowStock(threshold = 10) {
    const { data, error } = await db.from('products')
      .select('*')
      .eq('is_active', true)
      .lte('stock_quantity', threshold)
      .order('stock_quantity', { ascending: true })
    return { data, error }
  }
}

// Orders CRUD
export const ordersService = {
  async create(orderData) {
    const orderNumber = generateOrderNumber()
    const order = {
      order_number: orderNumber,
      user_id: orderData.userId || null,
      guest_email: orderData.guestEmail || null,
      guest_name: orderData.guestName || null,
      status: 'pending',
      payment_status: 'pending',
      payment_method: orderData.paymentMethod,
      subtotal: orderData.subtotal,
      shipping_cost: orderData.shippingCost || 0,
      discount: orderData.discount || 0,
      total: orderData.total,
      currency: orderData.currency || 'USD',
      items: orderData.items,
      shipping_address: orderData.shippingAddress,
      billing_address: orderData.billingAddress
    }
    
    const { data, error } = await db.from('orders').insert(order).select().single()
    
    if (!error && data) {
      // Create initial status history
      await db.from('order_status_history').insert({
        order_id: data.id,
        status: 'pending',
        description: 'Order placed'
      })
    }
    
    return { data, error }
  },

  async getById(id) {
    const { data, error } = await db.from('orders').select('*').eq('id', id).single()
    return { data, error }
  },

  async getByNumber(orderNumber) {
    const { data, error } = await db.from('orders').select('*').eq('order_number', orderNumber).single()
    return { data, error }
  },

  async getByUserId(userId) {
    const { data, error } = await db.from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async getByGuestEmail(email) {
    const { data, error } = await db.from('orders')
      .select('*')
      .eq('guest_email', email)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async updateStatus(id, status, description, createdBy = null) {
    const updates = { 
      status, 
      updated_at: new Date().toISOString() 
    }
    
    if (status === 'paid') updates.paid_at = new Date().toISOString()
    if (status === 'shipped') updates.shipped_at = new Date().toISOString()
    if (status === 'delivered') updates.delivered_at = new Date().toISOString()
    
    const { data, error } = await db.from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (!error && data) {
      await db.from('order_status_history').insert({
        order_id: id,
        status,
        description,
        created_by: createdBy
      })
    }
    
    return { data, error }
  },

  async updatePayment(id, paymentIntentId, paymentStatus) {
    const { data, error } = await db.from('orders')
      .update({
        stripe_payment_intent_id: paymentIntentId,
        payment_status: paymentStatus,
        paid_at: paymentStatus === 'succeeded' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async updateTracking(id, trackingNumber, carrier, estimatedDelivery) {
    const { data, error } = await db.from('orders')
      .update({
        tracking_number: trackingNumber,
        carrier,
        estimated_delivery: estimatedDelivery,
        status: 'shipped',
        shipped_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async getAll(filters = {}) {
    let query = db.from('orders').select('*')
    
    if (filters.status) query = query.eq('status', filters.status)
    if (filters.paymentStatus) query = query.eq('payment_status', filters.paymentStatus)
    if (filters.startDate) query = query.gte('created_at', filters.startDate)
    if (filters.endDate) query = query.lte('created_at', filters.endDate)
    
    const { data, error } = await query.order('created_at', { ascending: false })
    return { data, error }
  },

  async getStatusHistory(orderId) {
    const { data, error } = await db.from('order_status_history')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true })
    return { data, error }
  }
}

// Wishlist CRUD
export const wishlistService = {
  async add(userId, productId) {
    const { data, error } = await db.from('wishlists').insert({
      user_id: userId,
      product_id: productId
    }).select().single()
    return { data, error }
  },

  async remove(userId, productId) {
    const { data, error } = await db.from('wishlists')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId)
    return { data, error }
  },

  async getByUserId(userId) {
    const { data, error } = await db.from('wishlists')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async check(userId, productId) {
    const { data, error } = await db.from('wishlists')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single()
    return { data: !!data, error }
  }
}

// Reviews CRUD
export const reviewsService = {
  async create(review) {
    const { data, error } = await db.from('reviews').insert(review).select().single()
    return { data, error }
  },

  async getByProductId(productId, approvedOnly = true) {
    let query = db.from('reviews')
      .select('*')
      .eq('product_id', productId)
    
    if (approvedOnly) query = query.eq('is_approved', true)
    
    const { data, error } = await query.order('created_at', { ascending: false })
    return { data, error }
  },

  async getAverageRating(productId) {
    const { data, error } = await db.from('reviews')
      .select('rating')
      .eq('product_id', productId)
      .eq('is_approved', true)
    
    if (!data || data.length === 0) return { data: { average: 0, count: 0 }, error }
    
    const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length
    return { data: { average: avg.toFixed(1), count: data.length }, error }
  },

  async getAll(pendingOnly = false) {
    let query = db.from('reviews').select(`
      *,
      product:products(name, image_url)
    `)
    
    if (pendingOnly) query = query.eq('is_approved', false)
    
    const { data, error } = await query.order('created_at', { ascending: false })
    return { data, error }
  },

  async approve(id) {
    const { data, error } = await db.from('reviews')
      .update({ is_approved: true, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async delete(id) {
    const { data, error } = await db.from('reviews').delete().eq('id', id)
    return { data, error }
  }
}

// Promo Codes CRUD
export const promoCodesService = {
  async validate(code) {
    const { data, error } = await db.from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single()
    
    if (error || !data) return { valid: false, error: 'Invalid promo code' }
    
    const now = new Date()
    if (data.starts_at && new Date(data.starts_at) > now) {
      return { valid: false, error: 'Promo code not yet active' }
    }
    if (data.expires_at && new Date(data.expires_at) < now) {
      return { valid: false, error: 'Promo code has expired' }
    }
    if (data.max_uses && data.used_count >= data.max_uses) {
      return { valid: false, error: 'Promo code usage limit reached' }
    }
    
    return { valid: true, data }
  },

  async apply(code, orderTotal) {
    const validation = await this.validate(code)
    if (!validation.valid) return validation
    
    const promo = validation.data
    if (promo.min_order_amount && orderTotal < promo.min_order_amount) {
      return { valid: false, error: `Minimum order amount is $${promo.min_order_amount}` }
    }
    
    let discount = 0
    if (promo.discount_type === 'percentage') {
      discount = (orderTotal * promo.discount_value) / 100
    } else {
      discount = promo.discount_value
    }
    
    return { 
      valid: true, 
      discount: Math.min(discount, orderTotal),
      promo 
    }
  },

  async incrementUsage(id) {
    const { data, error } = await db.from('promo_codes')
      .update({ used_count: db.raw('used_count + 1') })
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async getAll() {
    const { data, error } = await db.from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async create(promo) {
    const { data, error } = await db.from('promo_codes')
      .insert({ ...promo, code: promo.code.toUpperCase() })
      .select()
      .single()
    return { data, error }
  },

  async update(id, updates) {
    const { data, error } = await db.from('promo_codes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async delete(id) {
    const { data, error } = await db.from('promo_codes').delete().eq('id', id)
    return { data, error }
  }
}

// Analytics (for admin dashboard)
export const analyticsService = {
  async getSalesStats(startDate, endDate) {
    const { data, error } = await db.from('orders')
      .select('total, status, created_at')
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .eq('payment_status', 'succeeded')
    
    if (error) return { data: null, error }
    
    const totalRevenue = data.reduce((sum, o) => sum + parseFloat(o.total), 0)
    const totalOrders = data.length
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    
    return { 
      data: { 
        totalRevenue, 
        totalOrders, 
        avgOrderValue,
        orders: data
      }, 
      error 
    }
  },

  async getTopProducts(limit = 10) {
    // This would need a more complex query with JSONB aggregation
    // For now, return recent orders
    const { data, error } = await db.from('orders')
      .select('items')
      .eq('payment_status', 'succeeded')
      .order('created_at', { ascending: false })
      .limit(100)
    
    if (error) return { data: [], error }
    
    // Aggregate product counts from order items
    const productCounts = {}
    data.forEach(order => {
      if (order.items) {
        order.items.forEach(item => {
          const id = item.id || item.productId
          if (!productCounts[id]) {
            productCounts[id] = { id, name: item.name, count: 0, revenue: 0 }
          }
          productCounts[id].count += item.quantity || 1
          productCounts[id].revenue += (item.price || 0) * (item.quantity || 1)
        })
      }
    })
    
    const sorted = Object.values(productCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
    
    return { data: sorted, error: null }
  },

  async getOrdersByStatus() {
    const { data, error } = await db.from('orders')
      .select('status')
    
    if (error) return { data: [], error }
    
    const counts = {}
    data.forEach(o => {
      counts[o.status] = (counts[o.status] || 0) + 1
    })
    
    return { data: counts, error: null }
  },

  async getCustomerStats() {
    const { data, error } = await db.from('orders')
      .select('user_id, guest_email')
      .eq('payment_status', 'succeeded')
    
    if (error) return { data: { total: 0, returning: 0, new: 0 }, error }
    
    const uniqueUsers = new Set()
    const uniqueGuests = new Set()
    
    data.forEach(o => {
      if (o.user_id) uniqueUsers.add(o.user_id)
      if (o.guest_email) uniqueGuests.add(o.guest_email)
    })
    
    return { 
      data: { 
        total: data.length,
        registered: uniqueUsers.size,
        guests: uniqueGuests.size
      }, 
      error 
    }
  }
}

export default db
