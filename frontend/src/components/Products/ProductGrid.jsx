import { useState } from "react"
import { useNotification } from "../../App"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import afrwear1 from "../../assets/afrwear1.webp"
import afrwear2 from "../../assets/Afrwear2.webp"
import afrwear4 from "../../assets/afrwear4.jpg"
import dress1 from "../../assets/dress1.jpg"
import wear2 from "../../assets/wear2.jpg"
import wear5 from "../../assets/wear5.jpg"
import wear6 from "../../assets/wear6.jpg"
import wear7 from "../../assets/wear7.jpg"
import woman1 from "../../assets/woman1.webp"
import woman3 from "../../assets/woman3.jpg"
import woman4 from "../../assets/woman4.jpg"
import woman5 from "../../assets/woman5.jpg"
import woman6 from "../../assets/woman6.jpg"

const ProductGrid = () => {
    const showNotification = useNotification()
    const { addToCart } = useCart()
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [addingProductId, setAddingProductId] = useState(null)

    const youMayAlsoLike = [
        {
            productId: 101,
            name: "Floral Print Dress",
            description: "Beautiful floral pattern dress perfect for casual outings",
            price: 49.99,
            originalPrice: 69.99,
            image: dress1,
            altText: "Floral Print Dress"
        },
        {
            productId: 102,
            name: "Ankara Peplum Top",
            description: "Elegant peplum top with authentic African print",
            price: 34.99,
            originalPrice: 44.99,
            image: afrwear1,
            altText: "Ankara Peplum Top"
        },
        {
            productId: 103,
            name: "Kaftan Dress",
            description: "Comfortable and stylish kaftan for special occasions",
            price: 59.99,
            originalPrice: 79.99,
            image: afrwear2,
            altText: "Kaftan Dress"
        },
        {
            productId: 104,
            name: "Wrap Dress",
            description: "Classic wrap dress with vibrant colors",
            price: 45.99,
            originalPrice: 59.99,
            image: afrwear4,
            altText: "Wrap Dress"
        },
        {
            productId: 105,
            name: "African Print Gown",
            description: "Elegant African print gown for special events",
            price: 54.99,
            originalPrice: 74.99,
            image: woman1,
            altText: "African Print Gown"
        },
        {
            productId: 106,
            name: "Traditional Wear",
            description: "Authentic traditional wear with modern touch",
            price: 44.99,
            originalPrice: 59.99,
            image: woman3,
            altText: "Traditional Wear"
        },
        {
            productId: 107,
            name: "Modern African Dress",
            description: "Contemporary African dress design",
            price: 64.99,
            originalPrice: 84.99,
            image: woman4,
            altText: "Modern African Dress"
        },
        {
            productId: 108,
            name: "Elegant Evening Wear",
            description: "Stunning evening wear for formal occasions",
            price: 79.99,
            originalPrice: 99.99,
            image: woman5,
            altText: "Elegant Evening Wear"
        },
        {
            productId: 109,
            name: "Casual African Style",
            description: "Comfortable casual wear with African prints",
            price: 39.99,
            originalPrice: 49.99,
            image: woman6,
            altText: "Casual African Style"
        }
    ]

    const topWearForWomen = [
        {
            productId: 201,
            name: "Blouse with Embroidery",
            description: "Hand-embroidered blouse with detailed patterns",
            price: 39.99,
            originalPrice: 54.99,
            image: wear5,
            altText: "Blouse with Embroidery"
        },
        {
            productId: 202,
            name: "Crop Top",
            description: "Trendy crop top perfect for summer styling",
            price: 24.99,
            originalPrice: 34.99,
            image: wear6,
            altText: "Crop Top"
        },
        {
            productId: 203,
            name: "Tunic Top",
            description: "Elegant tunic top for office or casual wear",
            price: 32.99,
            originalPrice: 42.99,
            image: wear7,
            altText: "Tunic Top"
        },
        {
            productId: 204,
            name: "Button-Down Shirt",
            description: "Classic button-down shirt with African print",
            price: 44.99,
            originalPrice: 59.99,
            image: wear2,
            altText: "Button-Down Shirt"
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

    const ProductCard = ({ product }) => (
        <div className="flex-shrink-0 w-64 overflow-hidden bg-white rounded-lg shadow-md">
            <div className="relative">
                <img 
                    src={product.image}
                    alt={product.altText}
                    className="object-cover w-full h-64"
                />
                {product.originalPrice > product.price && (
                    <div className="absolute px-2 py-1 text-xs font-bold text-white bg-red-600 rounded top-2 right-2">
                        SALE
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">{product.description}</p>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
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
    )

    return (
        <section className="py-12 bg-gray-50">
            {/* You May Also Like Section */}
            <div className="container mx-auto mb-16">
                <h2 className="mb-4 text-3xl font-bold text-center">You May Also Like</h2>
                <p className="mb-8 text-lg text-center text-gray-600">
                    Discover more styles you'll love
                </p>
                <div className="flex gap-6 pb-4 overflow-x-auto scroll-smooth">
                    {youMayAlsoLike.map(product => (
                        <ProductCard key={product.productId} product={product} />
                    ))}
                </div>
            </div>

            {/* Top Wear for Women Section */}
            <div className="container mx-auto">
                <h2 className="mb-4 text-3xl font-bold text-center">Top Wear for Women</h2>
                <p className="mb-8 text-lg text-center text-gray-600">
                    Explore our collection of stylish tops for women
                </p>
                <div className="flex gap-6 pb-4 overflow-x-auto scroll-smooth">
                    {topWearForWomen.map(product => (
                        <ProductCard key={product.productId} product={product} />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ProductGrid
