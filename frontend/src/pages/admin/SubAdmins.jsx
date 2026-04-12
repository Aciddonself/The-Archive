import { useState } from "react"
import { 
  FaUserPlus, 
  FaEdit, 
  FaTrash, 
  FaUserShield,
  FaCheck,
  FaTimes,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaMoneyBillWave,
  FaTag
} from "react-icons/fa"
import { useAuth } from "../../context/AuthContext"
import { useNotification } from "../../App"

const SubAdmins = () => {
  const { subAdmins, addSubAdmin, removeSubAdmin, isMainAdmin } = useAuth()
  const showNotification = useNotification()
  
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    permissions: []
  })

  const availablePermissions = [
    { id: "products", label: "Manage Products", icon: FaBox },
    { id: "orders", label: "Manage Orders", icon: FaShoppingCart },
    { id: "customers", label: "View Customers", icon: FaUsers },
    { id: "payments", label: "View Payments", icon: FaMoneyBillWave },
    { id: "categories", label: "Manage Categories", icon: FaTag },
  ]

  const handlePermissionChange = (permissionId) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!isMainAdmin()) {
      showNotification("error", "Only main admin can create sub-admins")
      return
    }

    const result = addSubAdmin(formData.name, formData.email, formData.password, formData.permissions)
    
    if (result.success) {
      showNotification("success", `Sub-admin "${formData.name}" created successfully!`)
      setShowModal(false)
      setFormData({ name: "", email: "", password: "", permissions: [] })
    } else {
      showNotification("error", result.error)
    }
  }

  const handleDelete = (id, name) => {
    if (!isMainAdmin()) {
      showNotification("error", "Only main admin can remove sub-admins")
      return
    }

    if (confirm(`Are you sure you want to remove "${name}" as sub-admin?`)) {
      removeSubAdmin(id)
      showNotification("success", `Sub-admin "${name}" removed successfully!`)
    }
  }

  if (!isMainAdmin()) {
    return (
      <div className="py-12 text-center">
        <FaUserShield className="mx-auto mb-4 text-6xl text-gray-300" />
        <h2 className="mb-2 text-2xl font-bold text-gray-800">Access Denied</h2>
        <p className="text-gray-600">Only the main admin can manage sub-admins.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Sub-Admin Management</h2>
          <p className="text-sm text-gray-500">Manage sub-admin accounts and their permissions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
        >
          <FaUserPlus /> Add Sub-Admin
        </button>
      </div>

      {/* Sub-Admins List */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subAdmins.length > 0 ? (
          subAdmins.map((admin) => (
            <div key={admin.id} className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full">
                    <FaUserShield className="text-xl text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{admin.name}</h3>
                    <p className="text-sm text-gray-500">{admin.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="mb-2 text-xs text-gray-500">Permissions:</p>
                <div className="flex flex-wrap gap-1">
                  {admin.permissions?.map(perm => (
                    <span key={perm} className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded">
                      {availablePermissions.find(p => p.id === perm)?.label || perm}
                    </span>
                  ))}
                  {(!admin.permissions || admin.permissions.length === 0) && (
                    <span className="text-xs text-gray-400">No permissions</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Created: {new Date(admin.createdAt).toLocaleDateString()}
                </p>
                <button
                  onClick={() => handleDelete(admin.id, admin.name)}
                  className="p-2 text-red-600 transition-colors rounded-lg hover:bg-red-50"
                  title="Remove"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <div className="p-12 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
              <FaUserShield className="mx-auto mb-4 text-6xl text-gray-300" />
              <h3 className="mb-2 text-xl font-semibold text-gray-800">No Sub-Admins Yet</h3>
              <p className="mb-4 text-gray-500">Create sub-admin accounts to help manage your store.</p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
              >
                <FaUserPlus /> Add First Sub-Admin
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Sub-Admin Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-lg bg-white shadow-xl rounded-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">Add New Sub-Admin</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Full name"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Password *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Password"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Permissions *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {availablePermissions.map(perm => (
                      <label
                        key={perm.id}
                        className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.permissions.includes(perm.id)
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(perm.id)}
                          onChange={() => handlePermissionChange(perm.id)}
                          className="sr-only"
                        />
                        <perm.icon className={`text-lg ${formData.permissions.includes(perm.id) ? "text-red-600" : "text-gray-400"}`} />
                        <span className="text-sm">{perm.label}</span>
                        {formData.permissions.includes(perm.id) && (
                          <FaCheck className="ml-auto text-red-600" />
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!formData.name || !formData.email || !formData.password || formData.permissions.length === 0}
                  className="px-4 py-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Create Sub-Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default SubAdmins
