import { useState, useEffect } from "react"
import { useLocation, Link } from "react-router-dom"
import { useNotification } from "../App"
import { useCart } from "../context/CartContext"
import { FaHome } from "react-icons/fa"
import man1 from "../assets/man1.webp"
import man3 from "../assets/man3.jpg"
import man5 from "../assets/man5.webp"
import man6 from "../assets/man6.jpg"
import man7 from "../assets/man7.jpg"
import men2 from "../assets/men2.jpg"
import kenya from "../assets/kenya.jpg"
import ke from "../assets/ke.jpg"
import ug1 from "../assets/ug1.webp"
import ug2 from "../assets/ug2.jpg"
import ug3 from "../assets/ug3.jpg"

// Default men products
const defaultMenProducts = [
    { id: 1, name: "Classic White Shirt", price: 29.99, originalPrice: 39.99, category: "topwear", sizes: ["S", "M", "L", "XL"], image: man5, productId: "default-1" },
    { id: 2, name: "Blue Denim Jeans", price: 49.99, originalPrice: 69.99, category: "bottoms", sizes: ["28", "30", "32", "34"], image: kenya, productId: "default-2" },
    { id: 3, name: "Black Leather Jacket", price: 89.99, originalPrice: 119.99, category: "topwear", sizes: ["S", "M", "L", "XL"], image: ug2, productId: "default-3" },
    { id: 4, name: "Executive Style", price: 74.99, originalPrice: 94.99, category: "topwear", sizes: ["S", "M", "L", "XL"], image: men2, productId: "default-4" },
    { id: 5, name: "Modern Menswear", price: 54.99, originalPrice: 74.99, category: "topwear", sizes: ["S", "M", "L", "XL"], image: ug1, productId: "default-5" },
    { id: 6, name: "Casual Denim", price: 44.99, originalPrice: 59.99, category: "bottoms", sizes: ["28", "30", "32", "34"], image: ug3, productId: "default-6" },
    { id: 7, name: "Kenya Safari Wear", price: 39.99, originalPrice: 49.99, category: "topwear", sizes: ["S", "M", "L", "XL"], image: ke, productId: "default-7" },
    { id: 8, name: "Uganda Traditional", price: 59.99, originalPrice: 79.99, category: "topwear", sizes: ["S", "M", "L", "XL"], image: man1, productId: "default-8" },
]

const MenPage = () => {
    const showNotification = useNotification()
    const { addToCart } = useCart()
    const location = useLocation()
    const [addingProductId, setAddingProductId] = useState(null)
    const [menProducts, setMenProducts] = useState(defaultMenProducts)
    const [selectedCategory, setSelectedCategory] = useState("all")
    
    // Determine current section based on pathname
    const getSectionTitle = () => {
        const path = location.pathname.toLowerCase()
        if (path === "/men") return "Men's Collection"
        if (path === "/topwear") return "Men's Topwear"
        if (path === "/bottoms") return "Men's Bottoms"
        if (selectedCategory === "all") return "Men's Collection"
        if (selectedCategory === "tops") return "Men's Tops"
        if (selectedCategory === "bottoms") return "Men's Bottoms"
        if (selectedCategory === "shoes") return "Men's Shoes"
        if (selectedCategory === "braces") return "Men's Braces"
        return "Men's Collection"
    }

    // Filter products by category
    const filteredProducts = selectedCategory === "all" 
        ? menProducts 
        : menProducts.filter(p => p.category === selectedCategory)

    // Load products from localStorage
    useEffect(() => {
        const loadProducts = () => {
            try {
                const storedProducts = JSON.parse(localStorage.getItem("products") || "[]")
                if (storedProducts && storedProducts.length > 0) {
                    const transformedProducts = storedProducts
                        .filter(p => {
                            const cat = p.category?.toLowerCase()
                            return cat === "men" || cat === "topwear" || cat === "bottoms" || cat === "accessories"
                        })
                        .map((p) => ({
                            ...p,
                            productId: p.id,
                            originalPrice: p.price * 1.2,
                            sizes: p.sizes && p.sizes.length > 0 ? p.sizes : ["S", "M", "L", "XL"]
                        }))
                    
                    // Combine: stored products first, then default
                    const combined = [...transformedProducts, ...defaultMenProducts]
                    // Remove duplicates by productId
                    const unique = combined.filter((item, index, self) => 
                        index === self.findIndex((t) => (t.productId || t.id) === (item.productId || item.id))
                    )
                    setMenProducts(unique)
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
                size: product.sizes ? product.sizes[0] : "M",
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
                {/* Sub Navigation */}
                <div className="mb-6">
                    <Link to="/" className="inline-flex items-center text-gray-600 hover:text-red-600">
                        <FaHome className="mr-2" /> Home
                    </Link>
                </div>
                
                {/* Category Navigation */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <button 
                        onClick={() => setSelectedCategory("all")}
                        className={`px-4 py-2 rounded-lg ${selectedCategory === "all" ? "bg-red-600 text-white" : "bg-gray-900 text-white hover:bg-red-600"}`}
                    >
                        All
                    </button>
                    <button 
                        onClick={() => setSelectedCategory("tops")}
                        className={`px-4 py-2 rounded-lg ${selectedCategory === "tops" ? "bg-red-600 text-white" : "bg-gray-900 text-white hover:bg-red-600"}`}
                    >
                        Tops
                    </button>
                    <button 
                        onClick={() => setSelectedCategory("bottoms")}
                        className={`px-4 py-2 rounded-lg ${selectedCategory === "bottoms" ? "bg-red-600 text-white" : "bg-gray-900 text-white hover:bg-red-600"}`}
                    >
                        Bottoms
                    </button>
                    <button 
                        onClick={() => setSelectedCategory("shoes")}
                        className={`px-4 py-2 rounded-lg ${selectedCategory === "shoes" ? "bg-red-600 text-white" : "bg-gray-900 text-white hover:bg-red-600"}`}
                    >
                        Shoes
                    </button>
                    <button 
                        onClick={() => setSelectedCategory("braces")}
                        className={`px-4 py-2 rounded-lg ${selectedCategory === "braces" ? "bg-red-600 text-white" : "bg-gray-900 text-white hover:bg-red-600"}`}
                    >
                        Braces
                    </button>
                </div>

                <h1 className="mb-2 text-3xl font-bold text-center">{getSectionTitle()}</h1>
                <h2 className="mb-8 text-xl text-center text-gray-600">Premium African Fashion for Men</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProducts.map((product) => (
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
                                <p className="text-gray-600 capitalize">{product.category}</p>
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
                
                {menProducts.length === 0 && (
                    <div className="py-12 text-center">
                        <p className="text-lg text-gray-500">Products here will be posted soon, keep checking while we keep you posted.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MenPage
