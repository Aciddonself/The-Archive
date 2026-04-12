import { useState, useEffect } from "react"
import { useNotification } from "../../App"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import b2 from "../../assets/b2.webp"
import b4 from "../../assets/b4.webp"
import b5 from "../../assets/b5.webp"
import ea1 from "../../assets/ea1.webp"
import hat from "../../assets/hat.jpg"

// Default African beads products
const defaultBeadsProducts = [
    {
        productId: 701,
        name: "Woven Bead Bracelet",
        description: "Hand-woven African bead bracelet",
        price: 8.99,
        originalPrice: 14.99,
        image: hat,
        altText: "Woven Bead Bracelet"
    },
    {
        productId: 702,
        name: "Traditional Bead Anklet",
        description: "Authentic African bead anklet",
        price: 12.99,
        originalPrice: 18.99,
        image: b2,
        altText: "Traditional Bead Anklet"
    },
    {
        productId: 703,
        name: "Beaded Earrings Set",
        description: "Set of 3 beaded African earrings",
        price: 15.99,
        originalPrice: 22.99,
        image: ea1,
        altText: "Beaded Earrings Set"
    },
    {
        productId: 704,
        name: "Beaded Necklace",
        description: "Handcrafted African bead necklace",
        price: 24.99,
        originalPrice: 34.99,
        image: b4,
        altText: "Beaded Necklace"
    },
    {
        productId: 705,
        name: "Beaded Belt",
        description: "Traditional African bead belt",
        price: 18.99,
        originalPrice: 28.99,
        image: b5,
        altText: "Beaded Belt"
    },
]

const AfricanBeads = () => {
    const showNotification = useNotification()
    const { addToCart } = useCart()
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [addingProductId, setAddingProductId] = useState(null)
    const [beadsProducts, setBeadsProducts] = useState(defaultBeadsProducts)

    // Load products from localStorage
    useEffect(() => {
        const loadProducts = () => {
            try {
                const storedProducts = JSON.parse(localStorage.getItem("products") || "[]")
                if (storedProducts && storedProducts.length > 0) {
                    const transformedProducts = storedProducts
                        .filter(p => {
                            const cat = p.category?.toLowerCase()
                            return cat === "beads" || cat === "african beads" || cat === "accessories"
                        })
                        .map((p) => ({
                            ...p,
                            productId: p.id,
                            originalPrice: p.price * 1.2,
                            altText: p.name
                        }))
                    
                    const combined = [...transformedProducts, ...defaultBeadsProducts]
                    const unique = combined.filter((item, index, self) => 
                        index === self.findIndex((t) => (t.productId || t.id) === (item.productId || item.id))
                    )
                    setBeadsProducts(unique)
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
            {beadsProducts.map((product) => (
                <div key={product.productId} className="overflow-hidden bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
                    <div className="overflow-hidden group">
                        <img 
                            src={product.image} 
                            alt={product.altText || product.name} 
                            className="object-cover w-full h-64 transform transition-transform duration-300 group-hover:scale-110" 
                        />
                    </div>
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

export default AfricanBeads
