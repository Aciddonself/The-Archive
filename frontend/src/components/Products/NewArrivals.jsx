// import man5 from "../../assets/man5.webp"
import { useState, useRef } from "react"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { useNotification } from "../../App"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import man5 from "../../assets/man5.webp"
import man6 from "../../assets/man6.jpg"
import man7 from "../../assets/man7.jpg"
import dress1 from "../../assets/dress1.jpg"
import wear1 from "../../assets/wear1.jpg"
import wear2 from "../../assets/wear2.jpg"
import wear3 from "../../assets/wear3.jpg"
import hat from "../../assets/hat.jpg"
// WhatsApp img imports
import waDress5 from "../../assets/whatsapp img/dress5.jpeg"
import waDress6 from "../../assets/whatsapp img/dress6.jpeg"
import waDress7 from "../../assets/whatsapp img/dress7.jpeg"
import waBag1 from "../../assets/whatsapp img/bag1.jpeg"
import waBag2 from "../../assets/whatsapp img/bag2.jpeg"
import waBag3 from "../../assets/whatsapp img/bag3.jpeg"
import waBraid1 from "../../assets/whatsapp img/braid1.jpeg"
import waBraid2 from "../../assets/whatsapp img/braid2.jpeg"
import waBraid3 from "../../assets/whatsapp img/braid3.jpeg"
import waShoe1 from "../../assets/whatsapp img/shoe1.jpeg"
import waTsht1 from "../../assets/whatsapp img/tsht1.jpeg"
import waTsht2 from "../../assets/whatsapp img/tsht2.jpeg"

const NewArrivals = () => {
    const showNotification = useNotification()
    const { addToCart } = useCart()
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const scrollRef = useRef(null)
    const [showLeftButton, setShowLeftButton] = useState(false)
    const [showRightButton, setShowRightButton] = useState(true)
    const [addingProductId, setAddingProductId] = useState(null)

    const handleScroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 320 // width of card + gap
            if (direction === 'left') {
                scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
            } else {
                scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
            }
        }
    }

    const handleScrollEnd = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
            setShowLeftButton(scrollLeft > 0)
            setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10)
        }
    }

    const handleAddToCart = async (product) => {
        // Check if user is logged in
        if (!isAuthenticated) {
            showNotification("error", "Please login to add items to cart")
            navigate("/login")
            return
        }

        setAddingProductId(product.productId)

        // Add to cart using CartContext
        addToCart(product, "M", "Default")

        // Show success notification
        showNotification("success", `${product.name} added to cart!`)
        setAddingProductId(null)
    }

    const newArrivals = [
        {
      productId: 1,
      name: "Classic White Shirt",
      price: 29.99,
      images: [
        {
            url: man5,
            altText: "Classic White Shirt"
        },
      ],
        },
        {
      productId: 2,
      name: "Blue Denim Jeans",
      price: 49.99,
      images: [
        {
            url: man6,
            altText: "Blue Denim Jeans"
        },
      ],
        },
        {
      productId: 3,
      name: "Black Leather Jacket",
      price: 89.99,
      images: [
        {
            url: man7,
            altText: "Black Leather Jacket"
        },
      ],
        },
        {
      productId: 4,
      name: "Summer Dress",
      price: 39.99,
      images: [
        {
            url: dress1,
            altText: "Summer Dress"
        },
      ],
        },
        {
      productId: 5,
      name: "Casual Wear",
      price: 34.99,
      images: [
        {
            url: wear1,
            altText: "Casual Wear"
        },
      ],
        },
        {
      productId: 6,
      name: "Formal Attire",
      price: 59.99,
      images: [
        {
            url: wear2,
            altText: "Formal Attire"
        },
      ],
        },
        {
      productId: 7,
      name: "Street Style",
      price: 44.99,
      images: [
        {
            url: wear3,
            altText: "Street Style"
        },
      ],
        },
        {
      productId: 8,
      name: "Accessories",
      price: 19.99,
      images: [
        {
            url: hat,
            altText: "Accessories"
        },
      ],
        },
        {
      productId: 9,
      name: "African Print Dress",
      price: 89.99,
      images: [
        {
            url: waDress5,
            altText: "African Print Dress"
        },
      ],
        },
        {
      productId: 10,
      name: "Evening Gown",
      price: 94.99,
      images: [
        {
            url: waDress6,
            altText: "Evening Gown"
        },
      ],
        },
        {
      productId: 11,
      name: "Designer Evening Gown",
      price: 94.99,
      images: [
        {
            url: waDress7,
            altText: "Designer Evening Gown"
        },
      ],
        },
        {
      productId: 12,
      name: "Luxury Handbag",
      price: 59.99,
      images: [
        {
            url: waBag1,
            altText: "Luxury Handbag"
        },
      ],
        },
        {
      productId: 13,
      name: "Designer Handbag",
      price: 49.99,
      images: [
        {
            url: waBag2,
            altText: "Designer Handbag"
        },
      ],
        },
        {
      productId: 14,
      name: "Leather Handbag",
      price: 64.99,
      images: [
        {
            url: waBag3,
            altText: "Leather Handbag"
        },
      ],
        },
        {
      productId: 15,
      name: "Hair Braids Style 1",
      price: 29.99,
      images: [
        {
            url: waBraid1,
            altText: "Hair Braids Style 1"
        },
      ],
        },
        {
      productId: 16,
      name: "Hair Braids Style 2",
      price: 29.99,
      images: [
        {
            url: waBraid2,
            altText: "Hair Braids Style 2"
        },
      ],
        },
        {
      productId: 17,
      name: "Hair Braids Style 3",
      price: 29.99,
      images: [
        {
            url: waBraid3,
            altText: "Hair Braids Style 3"
        },
      ],
        },
        {
      productId: 18,
      name: "Fashion Sneakers",
      price: 69.99,
      images: [
        {
            url: waShoe1,
            altText: "Fashion Sneakers"
        },
      ],
        },
        {
      productId: 19,
      name: "Casual T-Shirt",
      price: 24.99,
      images: [
        {
            url: waTsht1,
            altText: "Casual T-Shirt"
        },
      ],
        },
        {
      productId: 20,
      name: "Fashion T-Shirt",
      price: 24.99,
      images: [
        {
            url: waTsht2,
            altText: "Fashion T-Shirt"
        },
      ],
        },
    ];
  return (
    <section>
        <div className="container relative mb-10 text-center max-auto"> 
            <h2 className="text-3xl font-bold mb--4 ">Explore New Arrivals</h2>
            <p className="mb-8 text-lg text-gray-600">
                discover the latest styles straight off the runway,freshly added to keep your wardrobe on the cutting edge of the fashion.
            </p>

            {/* scroll buttons */}
            <div className="absolute right-0 bottom-[-30px] flex space-x-2">
                <button 
                    onClick={() => handleScroll('left')}
                    disabled={!showLeftButton}
                    className={`p-2 border rounded transition-colors duration-200 ${
                        showLeftButton 
                            ? 'text-black bg-white hover:bg-gray-100 cursor-pointer' 
                            : 'text-gray-300 bg-gray-100 cursor-not-allowed'
                    }`}
                >
                    <FiChevronLeft className="text-2xl" />
                </button>

                <button 
                    onClick={() => handleScroll('right')}
                    disabled={!showRightButton}
                    className={`p-2 border rounded transition-colors duration-200 ${
                        showRightButton 
                            ? 'text-black bg-white hover:bg-gray-100 cursor-pointer' 
                            : 'text-gray-300 bg-gray-100 cursor-not-allowed'
                    }`}
                >
                    <FiChevronRight className="text-2xl" />
                </button>
            </div>

        </div>

        <div 
            ref={scrollRef}
            onScroll={handleScrollEnd}
            className="container relative flex py-8 mx-auto space-x-6 overflow-x-auto scroll-smooth"
        >
            {newArrivals.map(product =>(
                <div key={product.productId} className="flex-shrink-0 w-64">
                    <img 
                        src={product.images[0]?.url}
                        alt={product.images[0]?.alt || product.name}
                        className="object-cover w-full rounded-lg shadow-lg h-80"
                    />
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                        <p className="text-gray-600">${product.price.toFixed(2)}</p>
                        <button
                            onClick={() => handleAddToCart(product)}
                            disabled={addingProductId === product.productId}
                            className={`w-full px-4 py-2 mt-2 text-white rounded-lg transition-colors ${
                                addingProductId === product.productId
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gray-900 hover:bg-red-600'
                            }`}
                        >
                            {addingProductId === product.productId ? 'Adding...' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            ))}

        </div>
    </section>
  )
}

export default NewArrivals
