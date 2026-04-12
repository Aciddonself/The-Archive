import { useState, useEffect } from "react"
import { 
  FaTag, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaBox,
  FaEye,
  FaCheck,
  FaTimes
} from "react-icons/fa"

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [formData, setFormData] = useState({ name: "", slug: "", status: "active" })

  // Load categories from localStorage
  useEffect(() => {
    const loadCategories = () => {
      try {
        const storedCategories = JSON.parse(localStorage.getItem("categories") || "[]")
        const storedProducts = JSON.parse(localStorage.getItem("products") || "[]")
        
        // Calculate product count for each category
        const categoriesWithCounts = storedCategories.map(category => ({
          ...category,
          productCount: storedProducts.filter(p => p.category === category.name).length
        }))
        
        setCategories(categoriesWithCounts)
      } catch (error) {
        console.error("Error loading categories:", error)
      }
      setLoading(false)
    }

    loadCategories()
  }, [])

  // Save categories to localStorage
  const saveCategories = (updatedCategories) => {
    localStorage.setItem("categories", JSON.stringify(updatedCategories))
    setCategories(updatedCategories)
  }

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category)
      setFormData({ name: category.name, slug: category.slug, status: category.status })
    } else {
      setEditingCategory(null)
      setFormData({ name: "", slug: "", status: "active" })
    }
    setShowModal(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.slug) {
      alert("Please fill in all required fields")
      return
    }

    // Check for duplicate slug
    const duplicate = categories.find(c => 
      c.slug === formData.slug && (!editingCategory || c.id !== editingCategory.id)
    )
    if (duplicate) {
      alert("A category with this URL slug already exists")
      return
    }

    if (editingCategory) {
      const updatedCategories = categories.map(c => 
        c.id === editingCategory.id 
          ? { ...c, name: formData.name, slug: formData.slug, status: formData.status }
          : c
      )
      saveCategories(updatedCategories)
    } else {
      const newCategory = {
        id: `cat-${Date.now()}`,
        name: formData.name,
        slug: formData.slug,
        productCount: 0,
        status: formData.status,
        createdAt: new Date().toISOString()
      }
      saveCategories([...categories, newCategory])
    }
    setShowModal(false)
    setFormData({ name: "", slug: "", status: "active" })
  }

  const handleDelete = (category) => {
    const updatedCategories = categories.filter(c => c.id !== category.id)
    saveCategories(updatedCategories)
    setDeleteConfirm(null)
  }

  const handleToggleStatus = (category) => {
    const updatedCategories = categories.map(c => 
      c.id === category.id 
        ? { ...c, status: c.status === "active" ? "inactive" : "active" }
        : c
    )
    saveCategories(updatedCategories)
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Product Categories</h2>
          <p className="text-sm text-gray-500">Manage your product categories - these will reflect on the website</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
        >
          <FaPlus /> Add Category
        </button>
      </div>

      {/* Categories Grid */}
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div key={category.id} className="p-6 transition-shadow bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg">
                    <FaTag className="text-xl text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{category.name}</h3>
                    <p className="text-sm text-gray-500">/{category.slug}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleStatus(category)}
                  className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                    category.status === "active" 
                      ? "bg-green-100 text-green-800 hover:bg-green-200" 
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {category.status === "active" ? <FaCheck className="w-3 h-3" /> : <FaTimes className="w-3 h-3" />}
                  {category.status}
                </button>
              </div>
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FaBox />
                  <span>{category.productCount} products</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(category)}
                    className="p-2 text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(category)}
                    className="p-2 text-red-600 transition-colors rounded-lg hover:bg-red-50"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
          <FaTag className="mx-auto text-4xl text-gray-300 mb-4" />
          <p className="text-gray-500">No categories found</p>
          <p className="text-sm text-gray-400">Click "Add Category" to create your first category</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md bg-white shadow-xl rounded-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">
                {editingCategory ? "Edit Category" : "Add Category"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    name: e.target.value, 
                    slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Men, Women, Kids"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">URL Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., men, women, kids"
                />
                <p className="mt-1 text-xs text-gray-500">This will be used in the URL: /shop/{formData.slug || 'slug'}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
              >
                {editingCategory ? "Save Changes" : "Add Category"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Delete Category</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{deleteConfirm.name}"? This will not delete products in this category.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Categories
