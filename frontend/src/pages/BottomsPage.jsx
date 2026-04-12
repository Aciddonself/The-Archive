import { useState, useEffect } from "react"
import { useNotification } from "../App"
import { useCart } from "../context/CartContext"
import man6 from "../assets/man6.jpg"
import man3 from "../assets/man3.jpg"

// Default bottoms products
const defaultBottomsProducts = [
    { id: 1, name: "Blue Denim Jeans", price: 49.99, originalPrice: 69.99, gender: "men", sizes: ["28", "30", "32", "34"], image: man6, productId: "default-b1" },
    { id: 2, name: "Casual Denim", price: 44.99, originalPrice: 59.99, gender: "men", sizes: ["28", "30", "32", "34"], image: man3, productId: "default-b2" },
]

const BottomsPage = () => {
    const showNotification = useNotification()
    const { addToCart } = useCart()
    const [addingProductId, setAddingProductId] = useState(null)
    const [bottomsProducts, setBottomsProducts] = useState(defaultBottomsProducts)

    // Load products from localStorage
    useEffect(() => {
        const loadProducts = () => {
            try {
                const storedProducts = JSON.parse(localStorage.getItem("products") || "[]")
                if (storedProducts && storedProducts.length > 0) {
                    const transformedProducts = storedProducts
                        .filter(p => p.category?.toLowerCase() === "bottoms")
                        .map((p) => ({
                            ...p,
                            productId: p.id,
                            originalPrice: p.price * 1.2,
                            sizes: p.sizes && p.sizes.length > 0 ? p.sizes : ["28", "30", "32", "34"]
                        }))
                    
                    const combined = [...transformedProducts, ...defaultBottomsProducts]
                    const unique = combined.filter((item, index, self) => 
                        index === self.findIndex((t) => (t.productId || t.id) === (item.productId || item.id))
                    )
                    setBottomsProducts(unique)
                }
            } catch (error) {
                console.error("Error loading products:", error)
            }
        }
        loadProducts()
    }, [])

    const handleAddToCart = (product) => {
        setAddingProductId(product.productId)
        setTimeout(() => {
            addToCart({
                productId: product.productId || product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                size: product.sizes ? product.sizes[0] : "30",
                color: "Default",
                quantity: 1
            })
            showNotification("success", `${product.name} added to cart!`)
            setAddingProductId(null)
        }, 500)
    }

    return (
        <div className="min-h-screen py-8 bg-gray-50">
            <div className="container px-4 mx-auto">
                <h1 className="mb-8 text-3xl font-bold text-center">Bottoms Collection</h1>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {bottomsProducts.map((product) => (
                        <div key={product.productId || product.id} className="overflow-hidden transition-shadow bg-white rounded-lg shadow-md hover:shadow-xl">
                            <div className="overflow-hidden group">
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="object-cover w-full h-64 transition-transform duration-300 transform group-hover:scale-110" 
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold">{product.name}</h3>
                                <p className="text-gray-600 capitalize">{product.gender}</p>
                                <div className="flex items-center gap-2 mt-2">
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

                {bottomsProducts.length === 0 && (
                    <div className="py-12 text-center">
                        <p className="text-lg text-gray-500">Products here will be posted soon, keep checking while we keep you posted.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BottomsPage
