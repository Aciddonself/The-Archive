import { FaTimes } from "react-icons/fa"
import CartContents from "../Carts/CartContents"

const CartDrawer = ({ isOpen, onClose, cartItems = [], onUpdateQuantity, onRemove, onCheckout }) => {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={onClose}
        ></div>
      )}

      {/* Drawer - Responsive width */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-80 md:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-gray-200 md:p-5">
          <h2 className="text-lg font-bold md:text-xl">
            Shopping Cart ({cartItems.length})
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-500 rounded-full hover:text-black hover:bg-gray-100"
          >
            <FaTimes className="w-5 h-5 md:h-6 md:w-6" />
          </button>
        </div>

        {/* Cart Content */}
        <CartContents 
          cartItems={cartItems} 
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemove}
        />

        {/* Footer with Checkout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t-2 border-gray-200 md:p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-semibold md:text-lg">Total:</span>
            <span className="text-lg md:text-xl font-bold text-[#ea2e0e]">${total}</span>
          </div>
          <button 
            onClick={onCheckout}
            className="w-full bg-[#ea2e0e] text-white py-3 md:py-4 rounded-xl font-semibold hover:bg-red-600 transition-colors text-base md:text-lg"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  )
}

export default CartDrawer
