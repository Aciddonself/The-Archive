import { FaTrash, FaMinus, FaPlus } from "react-icons/fa"

const CartContents = ({ cartItems = [], onUpdateQuantity, onRemove }) => {
  if (cartItems.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <p className="text-gray-500 text-lg">Your cart is empty</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
      {cartItems.map((item) => (
        <div 
          key={item.productId} 
          className="flex items-start border-2 border-gray-200 rounded-xl p-3 md:p-4 bg-white"
        >
          {/* Product Image */}
          <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-lg overflow-hidden">
            <img 
              src={item.image || `https://picsum.photos/seed/${item.productId}/200/200`} 
              alt={item.name} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="ml-3 md:ml-4 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-800 text-sm md:text-base">{item.name}</h3>
                <p className="text-xs md:text-sm text-gray-500">ID: {item.productId}</p>
              </div>
              <button 
                onClick={() => onRemove(item.productId)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <FaTrash className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-600">
              {item.size && (
                <span className="border border-gray-300 rounded px-2 py-0.5">Size: {item.size}</span>
              )}
              {item.color && (
                <span className="border border-gray-300 rounded px-2 py-0.5">Color: {item.color}</span>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between">
              {/* Quantity Controls */}
              <div className="flex items-center border-2 border-gray-200 rounded-lg">
                <button 
                  onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                  className="p-2 hover:bg-gray-100 rounded-l-md"
                >
                  <FaMinus className="h-3 w-3 md:h-4 md:w-4" />
                </button>
                <span className="px-3 md:px-4 text-sm md:text-base font-medium">{item.quantity}</span>
                <button 
                  onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                  className="p-2 hover:bg-gray-100 rounded-r-md"
                >
                  <FaPlus className="h-3 w-3 md:h-4 md:w-4" />
                </button>
              </div>

              {/* Price */}
              <span className="font-bold text-base md:text-lg text-[#ea2e0e]">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CartContents
