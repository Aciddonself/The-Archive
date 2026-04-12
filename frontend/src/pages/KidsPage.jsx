import { useState, useEffect } from "react"
import { useLocation, Link } from "react-router-dom"
import { useNotification } from "../App"
import { useCart } from "../context/CartContext"
import { FaHome } from "react-icons/fa"
import kid1 from "../assets/kid1.webp"
import kid2 from "../assets/kid2.webp"
import kid3 from "../assets/kid3.webp"
import kid4 from "../assets/kid4.webp"
import kid5 from "../assets/kid5.webp"
import kid6 from "../assets/kid6.webp"
import kid7 from "../assets/kid7.webp"

// Default kids products
const defaultKidsProducts = [
    { id: 1, name: "Kids African Print", price: 24.99, originalPrice: 34.99, category: "topwear", sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], image: kid1, productId: "default-k1" },
    { id: 2, name: "Kids Denim Jeans", price: 19.99, originalPrice: 29.99, category: "bottoms", sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], image: kid2, productId: "default-k2" },
    { id: 3, name: "Kids Party Dress", price: 29.99, originalPrice: 39.99, category: "dresses", sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], image: kid3, productId: "default-k3" },
    { id: 4, name: "Kids Ankara Set", price: 34.99, originalPrice: 44.99, category: "topwear", sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], image: kid4, productId: "default-k4" },
    { id: 5, name: "Kids Summer Wear", price: 22.99, originalPrice: 32.99, category: "topwear", sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], image: kid5, productId: "default-k5" },
    { id: 6, name: "Kids Casual Outfit", price: 27.99, originalPrice: 37.99, category: "topwear", sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], image: kid6, productId: "default-k6" },
    { id: 7, name: "Kids Traditional", price: 32.99, originalPrice: 42.99, category: "dresses", sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], image: kid7, productId: "default-k7" },
]

const KidsPage = () => {
    const showNotification = useNotification()
    const { addToCart } = useCart()
    const location = useLocation()
    const [addingProductId, setAddingProductId] = useState(null)
    const [kidsProducts, setKidsProducts] = useState(defaultKidsProducts)
    const [selectedCategory, setSelectedCategory] = useState("all")
    
    // Determine current section based on pathname
    const getSectionTitle = () => {
        const path = location.pathname.toLowerCase()
        if (path === "/kids") return "Kids Collection"
        if (path === "/children") return "Children's Wear"
        if (selectedCategory === "all") return "Kids Collection"
        if (selectedCategory === "dresses") return "Kids Dresses"
        if (selectedCategory === "tops") return "Kids Tops"
        if (selectedCategory === "bottoms") return "Kids Bottoms"
        if (selectedCategory === "shoes") return "Kids Shoes"
        return "Kids Collection"
    }

    // Filter products by category
    const filteredProducts = selectedCategory === "all" 
        ? kidsProducts 
        : kidsProducts.filter(p => p.category === selectedCategory)

    // Load products from localStorage
    useEffect(() => {
        const loadProducts = () => {
            try {
                const storedProducts = JSON.parse(localStorage.getItem("products") || "[]")
                if (storedProducts && storedProducts.length > 0) {
                    const transformedProducts = storedProducts
                        .filter(p => {
                            const cat = p.category?.toLowerCase()
                            return cat === "kids" || cat === "children" || cat === "topwear" || cat === "bottoms" || cat === "dresses"
                        })
                        .map((p) => ({
                            ...p,
                            productId: p.id,
                            originalPrice: p.price * 1.2,
                            sizes: p.sizes && p.sizes.length > 0 ? p.sizes : ["2-3Y", "4-5Y", "6-7Y", "8-9Y"]
                        }))
                    
                    const combined = [...transformedProducts, ...defaultKidsProducts]
                    const unique = combined.filter((item, index, self) => 
                        index === self.findIndex((t) => (t.productId || t.id) === (item.productId || item.id))
                    )
                    setKidsProducts(unique)
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
                size: product.sizes ? product.sizes[0] : "2-3Y",
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
                        onClick={() => setSelectedCategory("dresses")}
                        className={`px-4 py-2 rounded-lg ${selectedCategory === "dresses" ? "bg-red-600 text-white" : "bg-gray-900 text-white hover:bg-red-600"}`}
                    >
                        Dresses
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
                </div>

                <h1 className="mb-2 text-3xl font-bold text-center">{getSectionTitle()}</h1>
                <h2 className="mb-8 text-xl text-center text-gray-600">Cute & Colorful African Fashion for Kids</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

                {kidsProducts.length === 0 && (
                    <div className="py-12 text-center">
                        <p className="text-lg text-gray-500">Products here will be posted soon, keep checking while we keep you posted.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default KidsPage
