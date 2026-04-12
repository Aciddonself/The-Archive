import { useState, useEffect } from "react"
import { useNotification } from "../../App"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import hat from "../../assets/hat.jpg"
import man1 from "../../assets/man1.webp"
import afrwear1 from "../../assets/afrwear1.webp"
import afrwear2 from "../../assets/Afrwear2.webp"
import dress1 from "../../assets/dress1.jpg"
import man3 from "../../assets/man3.jpg"
import men2 from "../../assets/men2.jpg"
import wear2 from "../../assets/wear2.jpg"

// Default necklace products
const defaultNecklaceProducts = [
    {
        productId: 501,
        name: "African Beaded Necklace",
        description: "Handcrafted beaded necklace with traditional patterns",
        price: 15.99,
        originalPrice: 24.99,
        image: hat,
        altText: "African Beaded Necklace"
    },
    {
        productId: 502,
        name: "Gold Tribal Necklace",
        description: "Elegant gold-plated tribal design necklace",
        price: 29.99,
        originalPrice: 39.99,
        image: man1,
        altText: "Gold Tribal Necklace"
    },
    {
        productId: 503,
        name: "Pearl & Bead Combo",
        description: "Beautiful combination of pearls and African beads",
        price: 22.99,
        originalPrice: 32.99,
        image: afrwear1,
        altText: "Pearl & Bead Combo"
    },
]

const Necklaces = () => {
    const showNotification = useNotification()
    const { addToCart } = useCart()
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [addingProductId, setAddingProductId] = useState(null)
    const [necklaceProducts, setNecklaceProducts] = useState(defaultNecklaceProducts)

    // Load products from localStorage
    useEffect(() => {
        const loadProducts = () => {
            try {
                const storedProducts = JSON.parse(localStorage.getItem("products") || "[]")
                if (storedProducts && storedProducts.length > 0) {
                    const transformedProducts = storedProducts
                        .filter(p => p.category?.toLowerCase() === "necklaces")
                        .map((p) => ({
                            ...p,
                            productId: p.id,
                            originalPrice: p.price * 1.2,
                            altText: p.name
                        }))
                    
                    const combined = [...transformedProducts, ...defaultNecklaceProducts]
                    const unique = combined.filter((item, index, self) => 
                        index === self.findIndex((t) => (t.productId || t.id) === (item.productId || item.id))
                    )
                    setNecklaceProducts(unique)
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
            {necklaceProducts.map((product) => (
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

export default Necklaces
