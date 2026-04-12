import { useState, useEffect } from "react"
import { useNotification } from "../../App"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import man1 from "../../assets/man1.webp"
import men2 from "../../assets/men2.jpg"
import man3 from "../../assets/man3.jpg"
import man5 from "../../assets/man5.webp"
import man6 from "../../assets/man6.jpg"
import man7 from "../../assets/man7.jpg"
import wear2 from "../../assets/wear2.jpg"
import wear3 from "../../assets/wear3.jpg"

// Default braces products
const defaultBracesProducts = [
    {
        productId: 601,
        name: "Classic Suspenders",
        description: "Elegant formal suspenders for men",
        price: 24.99,
        originalPrice: 34.99,
        image: man1,
        altText: "Classic Suspenders"
    },
    {
        productId: 602,
        name: "Leather Braces",
        description: "Premium leather braces with metal clips",
        price: 39.99,
        originalPrice: 49.99,
        image: men2,
        altText: "Leather Braces"
    },
    {
        productId: 603,
        name: "Y-Back Braces",
        description: "Traditional Y-back suspenders",
        price: 19.99,
        originalPrice: 29.99,
        image: man3,
        altText: "Y-Back Braces"
    },
]

const Braces = () => {
    const showNotification = useNotification()
    const { addToCart } = useCart()
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [addingProductId, setAddingProductId] = useState(null)
    const [bracesProducts, setBracesProducts] = useState(defaultBracesProducts)

    // Load products from localStorage
    useEffect(() => {
        const loadProducts = () => {
            try {
                const storedProducts = JSON.parse(localStorage.getItem("products") || "[]")
                if (storedProducts && storedProducts.length > 0) {
                    const transformedProducts = storedProducts
                        .filter(p => p.category?.toLowerCase() === "braces" || p.category?.toLowerCase() === "suspenders")
                        .map((p) => ({
                            ...p,
                            productId: p.id,
                            originalPrice: p.price * 1.2,
                            altText: p.name
                        }))
                    
                    const combined = [...transformedProducts, ...defaultBracesProducts]
                    const unique = combined.filter((item, index, self) => 
                        index === self.findIndex((t) => (t.productId || t.id) === (item.productId || item.id))
                    )
                    setBracesProducts(unique)
                }
            } catch (error) {
                console.error("Error loading products:", error)
            }
        }
        loadProducts()
    }, [])

    const handleAddToCart = async (product) => {
        if (!isAuthenticated) {
            showNotification("info", "Please login to add items to cart")
            navigate("/login")
            return
        }

        setAddingProductId(product.productId)
        await new Promise(resolve => setTimeout(resolve, 500))
        addToCart({
            productId: product.productId || product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: "One Size",
            color: "Default",
            quantity: 1
        })
        showNotification("success", `${product.name} added to cart!`)
        setAddingProductId(null)
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bracesProducts.map((product) => (
                <div key={product.productId} className="overflow-hidden bg-white rounded-lg shadow-md">
                    <img 
                        src={product.image} 
                        alt={product.altText || product.name} 
                        className="object-cover w-full h-64" 
                    />
                    <div className="p-4">
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
                            {product.originalPrice > product.price && (
                                <span className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                            )}
                        </div>
                        <button
                            onClick={() => handleAddToCart(product)}
                            disabled={addingProductId === product.productId}
                            className={`w-full py-2 mt-3 text-white rounded-lg ${addingProductId === product.productId ? 'bg-gray-400' : 'bg-gray-900 hover:bg-red-600'}`}
                        >
                            {addingProductId === product.productId ? 'Adding...' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Braces
