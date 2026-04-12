import { useState } from "react"
import { FiChevronLeft, FiChevronRight, FiCheck, FiX } from "react-icons/fi"
import { FaHeart, FaRegHeart } from "react-icons/fa"
import { useNotification } from "../../App"
import { useAuth } from "../../context/AuthContext"
import { useWishlist } from "../../context/WishlistContext"
import { useNavigate } from "react-router-dom"
import afrwear1 from "../../assets/afrwear1.webp"
import afrwear2 from "../../assets/Afrwear2.webp"
import afrwear4 from "../../assets/afrwear4.jpg"
import dress1 from "../../assets/dress1.jpg"
import wear2 from "../../assets/wear2.jpg"
import wear5 from "../../assets/wear5.jpg"
import man1 from "../../assets/man1.webp"
import man3 from "../../assets/man3.jpg"
import men2 from "../../assets/men2.jpg"
import hat from "../../assets/hat.jpg"

const ProductDetails = () => {
    const showNotification = useNotification()
    const { isAuthenticated } = useAuth()
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
    const navigate = useNavigate()
    const [selectedProductIndex, setSelectedProductIndex] = useState(0)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [selectedSize, setSelectedSize] = useState("")
    const [quantity, setQuantity] = useState(1)
    const [notification, setNotification] = useState(null)
    const [isAddingToCart, setIsAddingToCart] = useState(false)

    const sizes = ["S", "M", "L", "XL", "XXL"]

    const bestSellers = [
        {
            productId: 1,
            name: "African Print Ankara",
            price: 79.99,
            originalPrice: 99.99,
            images: [
                { url: afrwear1, altText: "African Print Ankara" },
                { url: afrwear2, altText: "African Print View 2" },
                { url: afrwear4, altText: "African Print View 3" },
            ],
        },
        {
            productId: 2,
            name: "Traditional Wear",
            price: 89.99,
            originalPrice: 119.99,
            images: [
                { url: afrwear2, altText: "Traditional Wear" },
                { url: afrwear1, altText: "Traditional View 2" },
                { url: dress1, altText: "Traditional View 3" },
            ],
        },
        {
            productId: 3,
            name: "Elegant Dress",
            price: 59.99,
            originalPrice: 79.99,
            images: [
                { url: dress1, altText: "Elegant Dress" },
                { url: wear2, altText: "Elegant View 2" },
                { url: afrwear1, altText: "Elegant View 3" },
            ],
        },
        {
            productId: 4,
            name: "Classic Formal",
            price: 69.99,
            originalPrice: 89.99,
            images: [
                { url: wear2, altText: "Classic Formal" },
                { url: man1, altText: "Classic View 2" },
                { url: men2, altText: "Classic View 3" },
            ],
        },
        {
            productId: 5,
            name: "Premium Collection",
            price: 99.99,
            originalPrice: 129.99,
            images: [
                { url: wear5, altText: "Premium Collection" },
                { url: afrwear2, altText: "Premium View 2" },
                { url: dress1, altText: "Premium View 3" },
            ],
        },
        {
            productId: 6,
            name: "Modern Menswear",
            price: 54.99,
            originalPrice: 74.99,
            images: [
                { url: man1, altText: "Modern Menswear" },
                { url: man3, altText: "Modern View 2" },
                { url: men2, altText: "Modern View 3" },
            ],
        },
        {
            productId: 7,
            name: "Executive Style",
            price: 74.99,
            originalPrice: 94.99,
            images: [
                { url: men2, altText: "Executive Style" },
                { url: man1, altText: "Executive View 2" },
                { url: hat, altText: "Executive View 3" },
            ],
        },
    ];

    const handleProductSelect = (index) => {
        setSelectedProductIndex(index)
        setSelectedImageIndex(0)
        setSelectedSize("")
        setQuantity(1)
    }

    const handleImageSelect = (index) => {
        setSelectedImageIndex(index)
    }

    const handlePrevImage = () => {
        setSelectedImageIndex((prev) => 
            prev === 0 ? bestSellers[selectedProductIndex].images.length - 1 : prev - 1
        )
    }

    const handleNextImage = () => {
        setSelectedImageIndex((prev) => 
            prev === bestSellers[selectedProductIndex].images.length - 1 ? 0 : prev + 1
        )
    }

    const handleQuantityChange = (delta) => {
        setQuantity((prev) => Math.max(1, prev + delta))
    }

    const showNotificationMsg = (type, message) => {
        setNotification({ type, message })
        setTimeout(() => setNotification(null), 3000)
    }

    const handleAddToCart = async () => {
        // Check if user is logged in
        if (!isAuthenticated) {
            showNotification("error", "Please login to add items to cart")
            navigate("/login")
            return
        }

        if (!selectedSize) {
            showNotification("error", "Please select a size")
            return
        }
        if (quantity < 1) {
            showNotification("error", "Please select a valid quantity")
            return
        }

        // Start loading state
        setIsAddingToCart(true)

        // Simulate async operation (replace with actual API call if needed)
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Show success notification
        showNotification("success", `${currentProduct.name} (Size: ${selectedSize}, Qty: ${quantity}) Successfully added to cart!`)
        
        // Reset loading state
        setIsAddingToCart(false)
    }

    const currentProduct = bestSellers[selectedProductIndex]

    return (
        <section className="py-12 bg-gray-50">

            <div className="container mx-auto mb-10 text-center"> 
                <h2 className="mb-4 text-3xl font-bold">Best Sellers</h2>
                <p className="mb-8 text-lg text-gray-600">
                    Discover our most popular items, loved by customers worldwide.
                </p>
            </div>

            <div className="container mx-auto">
                {/* Product Selector - Horizontal Scroll */}
                <div className="flex gap-4 pb-4 mb-8 overflow-x-auto scroll-smooth">
                    {bestSellers.map((product, index) => (
                        <button
                            key={product.productId}
                            onClick={() => handleProductSelect(index)}
                            className={`flex-shrink-0 p-2 rounded-lg transition-all duration-200 ${
                                selectedProductIndex === index 
                                    ? 'bg-gray-900 text-white ring-2 ring-gray-900' 
                                    : 'bg-white hover:bg-gray-100'
                            }`}
                        >
                            <img 
                                src={product.images[0].url}
                                alt={product.name}
                                className="object-cover w-16 h-16 rounded"
                            />
                            <span className="block mt-1 text-xs">{product.name}</span>
                        </button>
                    ))}
                </div>

                {/* Main Content: Thumbnails - Image - Details */}
                <div className="flex flex-col gap-6 md:flex-row">
                    {/* Thumbnails - Left on desktop */}
                    <div className="flex order-2 gap-2 md:flex-col md:order-1">
                        {currentProduct.images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => handleImageSelect(index)}
                                className={`flex-shrink-0 p-1 rounded transition-all duration-200 ${
                                    selectedImageIndex === index 
                                        ? 'ring-2 ring-gray-900' 
                                        : 'hover:ring-1 hover:ring-gray-400'
                                }`}
                            >
                                <img 
                                    src={image.url}
                                    alt={image.altText}
                                    className="object-cover w-16 h-16 rounded md:w-20 md:h-20"
                                />
                            </button>
                        ))}
                    </div>

                    {/* Main Image - Center */}
                    <div className="relative flex-1 order-1 md:order-2">
                        <div className="relative overflow-hidden rounded-lg shadow-lg">
                            <img 
                                src={currentProduct.images[selectedImageIndex]?.url}
                                alt={currentProduct.images[selectedImageIndex]?.altText}
                                className="object-cover w-full h-[300px] md:h-[500px] transition-opacity duration-300"
                            />
                            
                            {/* Navigation Arrows */}
                            <button 
                                onClick={handlePrevImage}
                                className="absolute p-2 transition-colors -translate-y-1/2 rounded-full shadow-lg left-2 top-1/2 bg-white/80 hover:bg-white"
                            >
                                <FiChevronLeft className="text-xl" />
                            </button>
                            <button 
                                onClick={handleNextImage}
                                className="absolute p-2 transition-colors -translate-y-1/2 rounded-full shadow-lg right-2 top-1/2 bg-white/80 hover:bg-white"
                            >
                                <FiChevronRight className="text-xl" />
                            </button>

                            {/* Best Seller Badge */}
                            <div className="absolute px-3 py-1 text-sm font-bold text-white bg-red-600 rounded top-4 right-4">
                                Best Seller
                            </div>
                        </div>
                    </div>

                    {/* Product Details - Right Side */}
                    <div className="order-3 w-full md:w-80">
                        <h3 className="text-2xl font-semibold text-gray-800">{currentProduct.name}</h3>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-2xl font-bold text-gray-900">${currentProduct.price.toFixed(2)}</span>
                            <span className="text-lg text-gray-400 line-through">${currentProduct.originalPrice.toFixed(2)}</span>
                        </div>
                        <p className="mt-1 text-sm text-green-600">
                            Save ${(currentProduct.originalPrice - currentProduct.price).toFixed(2)}
                        </p>

                        {/* Size Selection */}
                        <div className="mt-6">
                            <p className="mb-2 font-medium text-gray-700">Select Size:</p>
                            <div className="flex gap-2">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-12 h-12 font-medium rounded transition-all ${
                                            selectedSize === size
                                                ? 'bg-gray-900 text-white'
                                                : 'bg-white border border-gray-300 hover:bg-gray-100'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity Selection */}
                        <div className="mt-6">
                            <p className="mb-2 font-medium text-gray-700">Quantity:</p>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleQuantityChange(-1)}
                                    className="w-10 h-10 font-bold bg-white border border-gray-300 rounded hover:bg-gray-100"
                                >
                                    -
                                </button>
                                <span className="w-12 text-lg font-semibold text-center">{quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(1)}
                                    className="w-10 h-10 font-bold bg-white border border-gray-300 rounded hover:bg-gray-100"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <button 
                            onClick={handleAddToCart}
                            disabled={isAddingToCart}
                            className={`w-full px-6 py-3 mt-6 text-lg font-semibold text-white transition-colors rounded-lg ${
                                isAddingToCart 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-gray-900 hover:bg-red-600'
                            }`}
                        >
                            {isAddingToCart ? 'Adding to cart...' : 'Add to Cart'}
                        </button>
                        <button 
                            onClick={() => {
                                if (!isAuthenticated) {
                                    showNotification("error", "Please login to add to wishlist")
                                    navigate("/login")
                                    return
                                }
                                if (isInWishlist(currentProduct.productId)) {
                                    removeFromWishlist(currentProduct.productId)
                                    showNotification("success", "Removed from wishlist")
                                } else {
                                    addToWishlist({
                                        id: currentProduct.productId,
                                        name: currentProduct.name,
                                        price: currentProduct.price,
                                        image: currentProduct.images[0]?.url,
                                        category: "best-seller"
                                    })
                                    showNotification("success", "Added to wishlist!")
                                }
                            }}
                            className={`w-full px-6 py-3 mt-2 text-lg font-semibold transition-colors rounded-lg border ${
                                isInWishlist(currentProduct.productId)
                                    ? 'bg-pink-50 border-pink-500 text-pink-600'
                                    : 'bg-white border-gray-300 text-gray-700 hover:border-pink-500 hover:text-pink-600'
                            }`}
                        >
                            {isInWishlist(currentProduct.productId) ? (
                                <>
                                    <FaHeart className="inline mr-2" />
                                    In Wishlist
                                </>
                            ) : (
                                <>
                                    <FaRegHeart className="inline mr-2" />
                                    Add to Wishlist
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ProductDetails
