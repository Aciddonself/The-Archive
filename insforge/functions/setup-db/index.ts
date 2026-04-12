import { createClient } from "@insforge/sdk"

const insforge = createClient({
  auth: { persistSession: false }
})

export default async function handler(req, context) {
  const results = { success: true, tables: [], errors: [] }

  try {
    // 1. Products table
    await insforge.rawQuery(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        original_price DECIMAL(10,2),
        category TEXT,
        gender TEXT,
        product_type TEXT,
        subcategory TEXT,
        image_url TEXT,
        images TEXT[],
        sizes TEXT[],
        colors TEXT[],
        stock_quantity INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        is_featured BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      )
    `).catch(e => results.errors.push({ table: 'products', error: e.message }))
    results.tables.push('products')

    // 2. Orders table
    await insforge.rawQuery(`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        order_number TEXT UNIQUE NOT NULL,
        user_id TEXT,
        guest_email TEXT,
        guest_name TEXT,
        status TEXT DEFAULT 'pending',
        payment_status TEXT DEFAULT 'pending',
        payment_method TEXT,
        stripe_payment_intent_id TEXT,
        subtotal DECIMAL(10,2) NOT NULL,
        shipping_cost DECIMAL(10,2) DEFAULT 0,
        discount DECIMAL(10,2) DEFAULT 0,
        total DECIMAL(10,2) NOT NULL,
        currency TEXT DEFAULT 'USD',
        items JSONB NOT NULL,
        shipping_address JSONB,
        billing_address JSONB,
        tracking_number TEXT,
        carrier TEXT,
        estimated_delivery DATE,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now(),
        paid_at TIMESTAMPTZ,
        shipped_at TIMESTAMPTZ,
        delivered_at TIMESTAMPTZ
      )
    `).catch(e => results.errors.push({ table: 'orders', error: e.message }))
    results.tables.push('orders')

    // 3. Order status history
    await insforge.rawQuery(`
      CREATE TABLE IF NOT EXISTS order_status_history (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
        status TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT now(),
        created_by TEXT
      )
    `).catch(e => results.errors.push({ table: 'order_status_history', error: e.message }))
    results.tables.push('order_status_history')

    // 4. Wishlist table
    await insforge.rawQuery(`
      CREATE TABLE IF NOT EXISTS wishlists (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id TEXT NOT NULL,
        product_id UUID REFERENCES products(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT now(),
        UNIQUE(user_id, product_id)
      )
    `).catch(e => results.errors.push({ table: 'wishlists', error: e.message }))
    results.tables.push('wishlists')

    // 5. Product reviews table
    await insforge.rawQuery(`
      CREATE TABLE IF NOT EXISTS reviews (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        product_id UUID REFERENCES products(id) ON DELETE CASCADE,
        user_id TEXT,
        user_name TEXT,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        title TEXT,
        comment TEXT,
        is_approved BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      )
    `).catch(e => results.errors.push({ table: 'reviews', error: e.message }))
    results.tables.push('reviews')

    // 6. Promo codes table
    await insforge.rawQuery(`
      CREATE TABLE IF NOT EXISTS promo_codes (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
        discount_value DECIMAL(10,2) NOT NULL,
        min_order_amount DECIMAL(10,2),
        max_uses INTEGER,
        used_count INTEGER DEFAULT 0,
        starts_at TIMESTAMPTZ,
        expires_at TIMESTAMPTZ,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT now()
      )
    `).catch(e => results.errors.push({ table: 'promo_codes', error: e.message }))
    results.tables.push('promo_codes')

    // 7. Admin roles table
    await insforge.rawQuery(`
      CREATE TABLE IF NOT EXISTS admin_roles (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        permissions JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT now()
      )
    `).catch(e => results.errors.push({ table: 'admin_roles', error: e.message }))
    results.tables.push('admin_roles')

    // 8. Categories table
    await insforge.rawQuery(`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        image_url TEXT,
        parent_id UUID REFERENCES categories(id),
        is_active BOOLEAN DEFAULT true,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT now()
      )
    `).catch(e => results.errors.push({ table: 'categories', error: e.message }))
    results.tables.push('categories')

    // Enable RLS on all tables
    const tablesToSecure = ['products', 'orders', 'wishlists', 'reviews', 'promo_codes', 'admin_roles', 'categories', 'order_status_history']
    for (const table of tablesToSecure) {
      try {
        await insforge.rawQuery(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY`)
      } catch (e) {
        // Ignore if already enabled
      }
    }

    // Create basic policies (public read for products and categories)
    await insforge.rawQuery(`CREATE POLICY "public_read_products" ON products FOR SELECT USING (true)`).catch(() => {})
    await insforge.rawQuery(`CREATE POLICY "public_read_categories" ON categories FOR SELECT USING (true)`).catch(() => {})

    results.success = results.errors.length === 0
    return Response.json(results)
  } catch (error) {
    return Response.json({ success: false, error: error.message, results }, { status: 500 })
  }
}
