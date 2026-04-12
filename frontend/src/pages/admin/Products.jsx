import { useState, useEffect, useRef } from "react"
import { 
  FaSearch, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaImage,
  FaFilter,
  FaArchive,
  FaUndo,
  FaDollarSign,
  FaBoxes,
  FaUpload,
  FaTimes,
  FaCheck,
  FaBookmark
} from "react-icons/fa"
import { useNotification } from "../../App"
import { useEmailNotifications } from "../../context/EmailNotificationContext"
import { insforge } from "../../lib/insforge"

const Products = () => {
  const [products, setProducts] = useState([])
  const [archivedProducts, setArchivedProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [showArchived, setShowArchived] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [sendEmailAlert, setSendEmailAlert] = useState(false)
  const [loading, setLoading] = useState(true)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    gender: "",
    productType: "",
    subCategory: "",
    price: "",
    stock: "",
    description: "",
    image: "",
    status: "active",
    sizes: [],
    colors: []
  })

  const showNotification = useNotification()
  const { notifyNewProduct } = useEmailNotifications()

  // Load products from InsForge database on mount, fallback to localStorage
  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Try to fetch from database first
        const { data: dbProducts, error } = await insforge
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (dbProducts && dbProducts.length > 0) {
          // Transform database products to match localStorage format
          const transformedProducts = dbProducts.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            gender: p.gender,
            productType: p.product_type,
            subCategory: p.subcategory,
            price: parseFloat(p.price),
            stock: p.stock_quantity || p.stock,
            status: p.is_active ? 'active' : 'archived',
            description: p.description,
            image: p.image_url || p.image,
            sizes: p.sizes || [],
            colors: p.colors || [],
            createdAt: p.created_at,
            updatedAt: p.updated_at
          }))
          setProducts(transformedProducts)
          // Also save to localStorage for offline backup
          localStorage.setItem("products", JSON.stringify(transformedProducts))
        } else {
          // Fallback to localStorage if no database products
          const storedProducts = JSON.parse(localStorage.getItem("products") || "[]")
          const storedArchived = JSON.parse(localStorage.getItem("archivedProducts") || "[]")
          setProducts(storedProducts)
          setArchivedProducts(storedArchived)
        }
      } catch (error) {
        console.error("Error loading products from database:", error)
        // Fallback to localStorage on error
        try {
          const storedProducts = JSON.parse(localStorage.getItem("products") || "[]")
          const storedArchived = JSON.parse(localStorage.getItem("archivedProducts") || "[]")
          setProducts(storedProducts)
          setArchivedProducts(storedArchived)
        } catch (e) {
          console.error("Error loading products from localStorage:", e)
        }
      }
      setLoading(false)
    }

    loadProducts()
  }, [])

  // Save products to InsForge database and localStorage
  const saveProducts = async (updatedProducts) => {
    localStorage.setItem("products", JSON.stringify(updatedProducts))
    setProducts(updatedProducts)
  }

  const saveArchivedProducts = (updatedArchived) => {
    localStorage.setItem("archivedProducts", JSON.stringify(updatedArchived))
    setArchivedProducts(updatedArchived)
  }

  // Get unique categories from products
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))]

  const getStockColor = (stock) => {
    if (stock === 0) return "text-red-600"
    if (stock < 10) return "text-yellow-600"
    return "text-green-600"
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterCategory === "all" || product.category === filterCategory
    return matchesSearch && matchesFilter
  })

  const filteredArchived = archivedProducts.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  // Handle image file upload - convert to base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      showNotification("error", "Please select a valid image file (JPEG, PNG, GIF, or WebP)")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification("error", "Image size must be less than 5MB")
      return
    }

    setUploading(true)
    
    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result })
      setImagePreview(reader.result)
      setUploading(false)
    }
    reader.onerror = () => {
      showNotification("error", "Failed to read image file")
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  // Handle removing uploaded image
  const handleRemoveImage = () => {
    setFormData({ ...formData, image: "" })
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product)
      setImagePreview(product.image || null)
      setFormData({
        name: product.name || "",
        category: product.category || "",
        gender: product.gender || "",
        productType: product.productType || "",
        subCategory: product.subCategory || "",
        price: product.price?.toString() || "",
        stock: product.stock?.toString() || "",
        description: product.description || "",
        image: product.image || "",
        status: product.status || "active",
        sizes: product.sizes || [],
        colors: product.colors || []
      })
    } else {
      setEditingProduct(null)
      setImagePreview(null)
      setFormData({
        name: "",
        category: "",
        gender: "",
        productType: "",
        subCategory: "",
        price: "",
        stock: "",
        description: "",
        image: "",
        status: "active",
        sizes: [],
        colors: []
      })
    }
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.category || !formData.price) {
      showNotification("error", "Please fill in all required fields")
      return
    }

    const now = new Date().toISOString()

    if (editingProduct) {
      // Update existing product in database
      try {
        const { error } = await insforge
          .from('products')
          .update({
            name: formData.name,
            category: formData.category,
            description: formData.description,
            price: parseFloat(formData.price),
            stock_quantity: parseInt(formData.stock) || 0,
            image_url: formData.image,
            is_active: formData.status === 'active'
          })
          .eq('id', editingProduct.id)

        if (error) throw error

        // Update local state
        const updatedProducts = products.map(p => 
          p.id === editingProduct.id 
            ? { 
                ...p, 
                name: formData.name, 
                category: formData.category,
                gender: formData.gender,
                productType: formData.productType,
                subCategory: formData.subCategory,
                price: parseFloat(formData.price), 
                stock: parseInt(formData.stock) || 0, 
                status: formData.status,
                description: formData.description,
                image: formData.image,
                updatedAt: now
              }
            : p
        )
        saveProducts(updatedProducts)
        showNotification("success", "Product updated successfully!")
      } catch (error) {
        console.error("Error updating product in database:", error)
        // Fallback to localStorage
        const updatedProducts = products.map(p => 
          p.id === editingProduct.id 
            ? { 
                ...p, 
                name: formData.name, 
                category: formData.category,
                gender: formData.gender,
                productType: formData.productType,
                subCategory: formData.subCategory,
                price: parseFloat(formData.price), 
                stock: parseInt(formData.stock) || 0, 
                status: formData.status,
                description: formData.description,
                image: formData.image,
                updatedAt: now
              }
            : p
        )
        saveProducts(updatedProducts)
        showNotification("success", "Product updated (saved locally due to error)")
      }
    } else {
      // Add new product to database
      try {
        const { data, error } = await insforge
          .from('products')
          .insert({
            name: formData.name,
            category: formData.category,
            description: formData.description,
            price: parseFloat(formData.price),
            stock_quantity: parseInt(formData.stock) || 0,
            image_url: formData.image,
            is_active: true,
            created_at: now,
            updated_at: now
          })
          .select()

        if (error) throw error

        // Create new product object with database ID
        const newProduct = {
          id: data[0].id,
          name: formData.name,
          category: formData.category,
          gender: formData.gender,
          productType: formData.productType,
          subCategory: formData.subCategory,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock) || 0,
          status: 'active',
          description: formData.description,
          image: formData.image,
          sizes: formData.sizes || [],
          colors: formData.colors || [],
          createdAt: now
        }
        const updatedProducts = [...products, newProduct]
        saveProducts(updatedProducts)

        // Send email notification if checkbox is checked
        if (sendEmailAlert) {
          const result = notifyNewProduct(newProduct)
          showNotification("success", `Product added! Email notifications sent to ${result.recipientCount} subscribers.`)
        } else {
          showNotification("success", "Product added successfully!")
        }
      } catch (error) {
        console.error("Error adding product to database:", error)
        // Fallback to localStorage
        const newProduct = {
          id: `prod-${Date.now()}`,
          name: formData.name,
          category: formData.category,
          gender: formData.gender,
          productType: formData.productType,
          subCategory: formData.subCategory,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock) || 0,
          status: formData.status,
          description: formData.description,
          image: formData.image,
          sizes: formData.sizes || [],
          colors: formData.colors || [],
          createdAt: now
        }
        const updatedProducts = [...products, newProduct]
        saveProducts(updatedProducts)
        showNotification("success", "Product added (saved locally due to error)")
      }
    }
    setShowModal(false)
    setSendEmailAlert(false)
    setImagePreview(null)
  }

  const confirmDelete = (product) => {
    setDeleteTarget(product)
    setShowDeleteConfirm(true)
  }

  const handleDelete = async () => {
    if (deleteTarget) {
      const now = new Date().toISOString()
      
      // Try to update in database first
      try {
        await insforge
          .from('products')
          .update({ is_active: false, updated_at: now })
          .eq('id', deleteTarget.id)
      } catch (error) {
        console.error("Error archiving product in database:", error)
      }
      
      // Archive the product in local state
      const archived = { ...deleteTarget, archivedAt: now, status: 'archived' }
      const updatedArchived = [archived, ...archivedProducts]
      const updatedProducts = products.filter(p => p.id !== deleteTarget.id)
      
      saveProducts(updatedProducts)
      saveArchivedProducts(updatedArchived)
      
      showNotification("success", "Product archived successfully!")
    }
    setShowDeleteConfirm(false)
    setDeleteTarget(null)
  }

  const handleRestore = async (product) => {
    const now = new Date().toISOString()
    
    // Try to update in database first
    try {
      await insforge
        .from('products')
        .update({ is_active: true, updated_at: now })
        .eq('id', product.id)
    } catch (error) {
      console.error("Error restoring product in database:", error)
    }
    
    const updatedProducts = [...products, { ...product, status: "active" }]
    const updatedArchived = archivedProducts.filter(p => p.id !== product.id)
    
    saveProducts(updatedProducts)
    saveArchivedProducts(updatedArchived)
    
    showNotification("success", "Product restored successfully!")
  }

  const handlePermanentDelete = async (id) => {
    // Try to delete from database first
    try {
      await insforge
        .from('products')
        .delete()
        .eq('id', id)
    } catch (error) {
      console.error("Error deleting product from database:", error)
    }
    
    const updatedArchived = archivedProducts.filter(p => p.id !== id)
    saveArchivedProducts(updatedArchived)
    showNotification("success", "Product permanently deleted!")
  }

  // Predefined categories for quick selection
  const genderCategories = ["men", "women", "kids", "unisex"]
  const productTypeCategories = ["hand bags", "shoes", "bangles", "earrings", "braids", "accessories", "beads"]
  const subCategories = ["top", "bottom"]
  
  // Combined category options (gender-producttype or just producttype)
  const combinedCategories = [
    // Gender-based categories
    "men-top", "men-bottom",
    "women-top", "women-bottom",
    "kids-top", "kids-bottom",
    "unisex-top", "unisex-bottom",
    // Product type categories
    "hand bags-top", "hand bags-bottom",
    "shoes-top", "shoes-bottom",
    "bangles-top", "bangles-bottom",
    "accessories-top", "accessories-bottom",
    "beads-top", "beads-bottom"
  ]

  // Legacy predefined categories for backwards compatibility
  const predefinedCategories = [
    "men", "women", "kids", "unisex",
    "hand bags", "shoes", "bangles",
    "accessories", "beads"
  ]

  const stats = {
    total: products.length,
    outOfStock: products.filter(p => p.stock === 0).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock < 10).length,
    totalValue: products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-red-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <p className="text-sm text-gray-500">Out of Stock</p>
          <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
        </div>
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <p className="text-sm text-gray-500">Low Stock</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
        </div>
        <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
          <p className="text-sm text-gray-500">Total Value</p>
          <p className="text-2xl font-bold text-gray-800">${stats.totalValue.toFixed(2)}</p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div className="flex flex-1 gap-2">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showArchived ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaArchive /> Archived ({archivedProducts.length})
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
            >
              <FaPlus /> Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      {!showArchived ? (
        <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
          {filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Stock</th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-500">#{product.id.slice(-6)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-12 h-12 overflow-hidden bg-gray-200 rounded-lg">
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
                            ) : (
                              <FaImage className="text-gray-400" />
                            )}
                          </div>
                          <span className="font-medium text-gray-800">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">${(product.price || 0).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`font-medium ${getStockColor(product.stock)}`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.stock === 0 
                            ? "bg-red-100 text-red-800" 
                            : product.booked === true
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}>
                          {product.stock === 0 ? "Sold" : product.booked === true ? "Booked" : "Available"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenModal(product)}
                            className="p-2 text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => confirmDelete(product)}
                            className="p-2 text-red-600 transition-colors rounded-lg hover:bg-red-50"
                            title="Archive"
                          >
                            <FaArchive />
                          </button>
                          <button
                            onClick={() => {
                              const updatedProducts = products.map(p => 
                                p.id === product.id ? { ...p, booked: !p.booked } : p
                              )
                              setProducts(updatedProducts)
                              localStorage.setItem("products", JSON.stringify(updatedProducts))
                              showNotification("success", product.booked ? "Product marked as available" : "Product marked as booked")
                            }}
                            className={`p-2 transition-colors rounded-lg ${product.booked ? 'text-yellow-600 bg-yellow-50' : 'text-gray-600 hover:bg-gray-50'}`}
                            title={product.booked ? "Mark as Available" : "Mark as Booked"}
                          >
                            <FaBookmark />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <FaBoxes className="mx-auto mb-4 text-4xl text-gray-300" />
              <p className="text-gray-500">No products found</p>
              <p className="text-sm text-gray-400">Click "Add Product" to create your first product</p>
            </div>
          )}
        </div>
      ) : (
        // Archived Products
        <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
          {filteredArchived.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Archived</th>
                    <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredArchived.map((product) => (
                    <tr key={product.id} className="opacity-75 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-12 h-12 overflow-hidden bg-gray-200 rounded-lg">
                            {product.image ? (
                              <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
                            ) : (
                              <FaImage className="text-gray-400" />
                            )}
                          </div>
                          <span className="font-medium text-gray-800">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">${(product.price || 0).toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {product.archivedAt ? new Date(product.archivedAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRestore(product)}
                            className="p-2 text-green-600 transition-colors rounded-lg hover:bg-green-50"
                            title="Restore"
                          >
                            <FaUndo />
                          </button>
                          <button
                            onClick={() => handlePermanentDelete(product.id)}
                            className="p-2 text-red-600 transition-colors rounded-lg hover:bg-red-50"
                            title="Delete Permanently"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-500">No archived products</p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Image Upload Section */}
              <div className="col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700">Product Image</label>
                <div className="space-y-3">
                  {/* Image Preview */}
                  {(imagePreview || formData.image) && (
                    <div className="relative inline-block">
                      <img 
                        src={imagePreview || formData.image} 
                        alt="Preview" 
                        className="object-cover w-32 h-32 border border-gray-300 rounded-lg"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute p-1 text-white bg-red-600 rounded-full -top-2 -right-2 hover:bg-red-700"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </div>
                  )}
                  
                  {/* Upload Button */}
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className={`flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <FaUpload />
                      {uploading ? 'Uploading...' : 'Upload Image'}
                    </label>
                    <span className="text-xs text-gray-500">or</span>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => {
                        setFormData({ ...formData, image: e.target.value })
                        setImagePreview(e.target.value)
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Paste image URL here..."
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Supported formats: JPEG, PNG, GIF, WebP. Max size: 5MB
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Gender *</label>
                  <select
                    value={formData.gender || ""}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    {genderCategories.map(cat => (
                      <option key={cat} value={cat} className="capitalize">{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Product Type *</label>
                  <select
                    value={formData.productType || ""}
                    onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select Type</option>
                    {productTypeCategories.map(cat => (
                      <option key={cat} value={cat} className="capitalize">{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Subcategory *</label>
                  <select
                    value={formData.subCategory || ""}
                    onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select Subcategory</option>
                    {subCategories.map(cat => (
                      <option key={cat} value={cat} className="capitalize">{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Category (Combined) *</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., men-top, women-bottom, hand bags"
                    list="combinedCategories"
                  />
                  <datalist id="combinedCategories">
                    {combinedCategories.map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows="3"
                    placeholder="Product description"
                  />
                </div>
                {!editingProduct && (
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sendEmailAlert}
                        onChange={(e) => setSendEmailAlert(e.target.checked)}
                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-600">Send email notification to subscribers</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Quick Category Buttons */}
              <div className="pt-2">
                <p className="mb-2 text-sm text-gray-600">Quick select gender:</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {genderCategories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: cat })}
                      className={`px-3 py-1 text-xs rounded-full capitalize transition-colors ${
                        formData.gender === cat 
                          ? "bg-red-600 text-white" 
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <p className="mb-2 text-sm text-gray-600">Quick select product type:</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {productTypeCategories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, productType: cat })}
                      className={`px-3 py-1 text-xs rounded-full capitalize transition-colors ${
                        formData.productType === cat 
                          ? "bg-red-600 text-white" 
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <p className="mb-2 text-sm text-gray-600">Quick select combined category:</p>
                <div className="flex flex-wrap gap-2">
                  {combinedCategories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={`px-3 py-1 text-xs rounded-full capitalize transition-colors ${
                        formData.category === cat 
                          ? "bg-red-600 text-white" 
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                {editingProduct ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-xl">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <FaArchive className="text-xl text-red-600" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-800">Archive Product</h3>
              <p className="mb-6 text-gray-600">
                Are you sure you want to archive "{deleteTarget?.name}"? 
                You can restore it later from the archived products.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Archive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products
