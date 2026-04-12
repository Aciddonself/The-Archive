import { useState } from "react"
import { useNotification } from "../../App"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import kid1 from "../../assets/kid1.webp"
import kid2 from "../../assets/kid2.webp"
import kid3 from "../../assets/kid3.webp"
import kid4 from "../../assets/kid4.webp"
import kid5 from "../../assets/kid5.webp"
import kid6 from "../../assets/kid6.webp"
import kid7 from "../../assets/kid7.webp"
// WhatsApp img imports
import waDress1 from "../../assets/whatsapp img/dress1.jpeg"
import waDress2 from "../../assets/whatsapp img/dress2.jpeg"
import waDress3 from "../../assets/whatsapp img/dress3.jpeg"
import waDress4 from "../../assets/whatsapp img/dress4.jpeg"

const KidsWear = () => {
    const showNotification = useNotification()
    const { addToCart } = useCart()
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [addingProductId, setAddingProductId] = useState(null)

    const kidsProducts = [
        {
            productId: 401,
            name: "Kids African Print Shirt",
            description: "Colorful African print shirt for boys",
            price: 24.99,
            originalPrice: 34.99,
            image: kid1,
            altText: "Kids African Print Shirt",
            age: "5-8 years"
        },
        {
            productId: 402,
            name: "Kids Denim Jeans",
            description: "Comfortable denim jeans for everyday wear",
            price: 19.99,
            originalPrice: 29.99,
            image: kid2,
            altText: "Kids Denim Jeans",
            age: "3-5 years"
        },
        {
            productId: 403,
            name: "Kids Party Dress",
            description: "Beautiful party dress for girls",
            price: 29.99,
            originalPrice: 39.99,
            image: kid3,
            altText: "Kids Party Dress",
            age: "4-7 years"
        },
        {
            productId: 404,
            name: "Kids Ankara Set",
            description: "Matching Ankara outfit set for boys",
            price: 34.99,
            originalPrice: 44.99,
            image: kid4,
            altText: "Kids Ankara Set",
            age: "6-10 years"
        },
        {
            productId: 405,
            name: "Kids Traditional Gown",
            description: "Elegant traditional gown for girls",
            price: 32.99,
            originalPrice: 42.99,
            image: kid5,
            altText: "Kids Traditional Gown",
            age: "5-9 years"
        },
        {
            productId: 406,
            name: "Kids Casual Hoodie",
            description: "Warm and stylish hoodie for boys",
            price: 22.99,
            originalPrice: 32.99,
            image: kid6,
            altText: "Kids Casual Hoodie",
            age: "4-8 years"
        },
        {
            productId: 407,
            name: "Kids Summer Top",
            description: "Light and breathable summer top",
            price: 15.99,
            originalPrice: 22.99,
            image: kid7,
            altText: "Kids Summer Top",
            age: "3-6 years"
        },
        {
            productId: 408,
            name: "Kids Classic Jacket",
            description: "Stylish jacket for special occasions",
            price: 39.99,
            originalPrice: 49.99,
            image: kid1,
            altText: "Kids Classic Jacket",
            age: "6-12 years"
        },
        {
            productId: 409,
            name: "Kids African Dress",
            description: "Beautiful African print dress for girls",
            price: 29.99,
            originalPrice: 39.99,
            image: waDress1,
            altText: "Kids African Dress",
            age: "4-8 years"
        },
        {
            productId: 410,
            name: "Kids Casual Dress",
            description: "Comfortable casual dress for everyday",
            price: 24.99,
            originalPrice: 34.99,
            image: waDress2,
            altText: "Kids Casual Dress",
            age: "3-7 years"
        },
        {
            productId: 411,
            name: "Kids Party Dress",
            description: "Elegant party dress for special occasions",
            price: 34.99,
            originalPrice: 44.99,
            image: waDress3,
            altText: "Kids Party Dress",
            age: "5-10 years"
        },
        {
            productId: 412,
            name: "Kids Summer Dress",
            description: "Light summer dress for hot days",
            price: 19.99,
            originalPrice: 29.99,
            image: waDress4,
            altText: "Kids Summer Dress",
            age: "3-6 years"
        }
    ]

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

    return (
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto">
                <h2 className="mb-4 text-4xl font-bold text-center">Kids Wear Collection</h2>
                <p className="mb-12 text-lg text-center text-gray-600">
                    Adorable and comfortable outfits for your little ones
                </p>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {kidsProducts.map((product) => (
                        <div key={product.productId} className="overflow-hidden transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg">
                            <div className="relative">
                                <img 
                                    src={product.image}
                                    alt={product.altText}
                                    className="object-cover w-full h-64"
                                />
                                <div className="absolute top-2 left-2">
                                    <span className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded">
                                        {product.age}
                                    </span>
                                </div>
                                {product.originalPrice > product.price && (
                                    <div className="absolute px-2 py-1 text-xs font-bold text-white bg-red-600 rounded top-2 right-2">
                                        SALE
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                                <p className="mt-1 text-sm text-gray-600">{product.description}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                                    {product.originalPrice > product.price && (
                                        <span className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    disabled={addingProductId === product.productId}
                                    className={`w-full px-4 py-2 mt-3 text-white rounded-lg transition-colors ${
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
            </div>
        </section>
    )
}

export default KidsWear