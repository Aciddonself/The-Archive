import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaHeart, FaTrash, FaShoppingBag } from "react-icons/fa"
import { useWishlist } from "../context/WishlistContext"
import { useCart } from "../context/CartContext"
import { useNotification } from "../App"
import man1 from "../assets/man1.webp"

const WishlistPage = () => {
  const navigate = useNavigate()
  const showNotification = useNotification()
  const { wishlist, removeFromWishlist, loading } = useWishlist()
  const { addToCart } = useCart()
  const [addingProductId, setAddingProductId] = useState(null)

  const handleAddToCart = (product) => {
    setAddingProductId(product.id)
    setTimeout(() => {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || man1,
        quantity: 1,
        sizes: product.sizes || ["S", "M", "L", "XL"],
        colors: product.colors || []
      })
      showNotification("success", "Added to cart!")
      setAddingProductId(null)
    }, 300)
  }

  const handleRemove = (productId) => {
    removeFromWishlist(productId)
    showNotification("success", "Removed from wishlist")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <span className="text-gray-600">{wishlist.length} items</span>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-16">
            <FaHeart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Save items you love to your wishlist</p>
            <Link
              to="/shop"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              <FaShoppingBag className="mr-2" />
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Link to={`/product/${product.id}`}>
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                    <img
                      src={product.image || product.image_url || man1}
                      alt={product.name}
                      className="w-full h-64 object-cover object-center"
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <Link to={`/product/${product.id}`} className="block">
                    <h3 className="text-lg font-medium text-gray-900 truncate">{product.name}</h3>
                  </Link>
                  <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-lg font-bold text-red-600">${product.price?.toFixed(2)}</p>
                    {product.originalPrice && (
                      <p className="text-sm text-gray-500 line-through">${product.originalPrice?.toFixed(2)}</p>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={addingProductId === product.id}
                      className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
                    >
                      {addingProductId === product.id ? (
                        <span className="animate-pulse">Adding...</span>
                      ) : (
                        <>
                          <FaShoppingBag className="mr-2" />
                          Add to Cart
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleRemove(product.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Remove from wishlist"
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default WishlistPage
