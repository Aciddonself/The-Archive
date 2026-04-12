import { useState, useEffect } from "react"
import { FaTag, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaPercent, FaDollarSign } from "react-icons/fa"
import { useNotification } from "../../App"
import { promoCodesService } from "../../lib/database"

const PromoCodes = () => {
  const showNotification = useNotification()
  const [promoCodes, setPromoCodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCode, setEditingCode] = useState(null)
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    maxUses: "",
    startsAt: "",
    expiresAt: ""
  })

  useEffect(() => {
    loadPromoCodes()
  }, [])

  const loadPromoCodes = async () => {
    try {
      const { data, error } = await promoCodesService.getAll()
      if (!error && data) {
        setPromoCodes(data)
      }
    } catch (error) {
      console.error("Error loading promo codes:", error)
    }
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const promo = {
      code: formData.code.toUpperCase(),
      discount_type: formData.discountType,
      discount_value: parseFloat(formData.discountValue),
      min_order_amount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : null,
      max_uses: formData.maxUses ? parseInt(formData.maxUses) : null,
      starts_at: formData.startsAt || null,
      expires_at: formData.expiresAt || null,
      is_active: true
    }

    try {
      let result
      if (editingCode) {
        result = await promoCodesService.update(editingCode.id, promo)
      } else {
        result = await promoCodesService.create(promo)
      }

      if (!result.error) {
        showNotification("success", editingCode ? "Promo code updated!" : "Promo code created!")
        setShowModal(false)
        resetForm()
        loadPromoCodes()
      }
    } catch (error) {
      console.error("Error saving promo code:", error)
      showNotification("error", "Failed to save promo code")
    }
  }

  const handleEdit = (code) => {
    setEditingCode(code)
    setFormData({
      code: code.code,
      discountType: code.discount_type,
      discountValue: code.discount_value.toString(),
      minOrderAmount: code.min_order_amount?.toString() || "",
      maxUses: code.max_uses?.toString() || "",
      startsAt: code.starts_at ? code.starts_at.split("T")[0] : "",
      expiresAt: code.expires_at ? code.expires_at.split("T")[0] : ""
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this promo code?")) return

    try {
      const { error } = await promoCodesService.delete(id)
      if (!error) {
        showNotification("success", "Promo code deleted!")
        loadPromoCodes()
      }
    } catch (error) {
      console.error("Error deleting promo code:", error)
      showNotification("error", "Failed to delete promo code")
    }
  }

  const handleToggleActive = async (code) => {
    try {
      await promoCodesService.update(code.id, { is_active: !code.is_active })
      showNotification("success", `Promo code ${code.is_active ? "deactivated" : "activated"}!`)
      loadPromoCodes()
    } catch (error) {
      console.error("Error toggling promo code:", error)
    }
  }

  const resetForm = () => {
    setEditingCode(null)
    setFormData({
      code: "",
      discountType: "percentage",
      discountValue: "",
      minOrderAmount: "",
      maxUses: "",
      startsAt: "",
      expiresAt: ""
    })
  }

  const isExpired = (code) => {
    if (!code.expires_at) return false
    return new Date(code.expires_at) < new Date()
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Promo Codes</h1>
        <button
          onClick={() => { resetForm(); setShowModal(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          <FaPlus />
          Add Promo Code
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : promoCodes.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No promo codes yet. Create your first one!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promoCodes.map((code) => (
            <div key={code.id} className={`bg-white rounded-lg shadow-md p-6 ${!code.is_active || isExpired(code) ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FaTag className="text-red-600" />
                  <span className="font-mono font-bold text-lg">{code.code}</span>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  code.is_active && !isExpired(code)
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {code.is_active && !isExpired(code) ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                  {code.discount_type === "percentage" ? (
                    <>
                      <FaPercent className="text-green-600" />
                      {code.discount_value}%
                    </>
                  ) : (
                    <>
                      <FaDollarSign className="text-green-600" />
                      {code.discount_value}
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {code.discount_type === "percentage" ? "percentage discount" : "flat discount"}
                </p>
              </div>

              <div className="text-sm text-gray-600 space-y-1 mb-4">
                {code.min_order_amount && (
                  <p>Min order: ${code.min_order_amount}</p>
                )}
                <p>Used: {code.used_count || 0} {code.max_uses ? `/ ${code.max_uses}` : ""}</p>
                {code.expires_at && (
                  <p>Expires: {new Date(code.expires_at).toLocaleDateString()}</p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(code)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggleActive(code)}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg ${
                    code.is_active
                      ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  {code.is_active ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => handleDelete(code.id)}
                  className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">
              {editingCode ? "Edit Promo Code" : "Create Promo Code"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., SUMMER20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder={formData.discountType === "percentage" ? "e.g., 20" : "e.g., 10"}
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Amount</label>
                  <input
                    type="number"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="e.g., 50"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Uses</label>
                  <input
                    type="number"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="Leave empty for unlimited"
                    min="1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={formData.startsAt}
                      onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="date"
                      value={formData.expiresAt}
                      onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  {editingCode ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm() }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PromoCodes
