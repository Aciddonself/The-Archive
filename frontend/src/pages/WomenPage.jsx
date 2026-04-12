import { useState, useEffect } from "react"
import { useLocation, Link } from "react-router-dom"
import { useNotification } from "../App"
import { useCart } from "../context/CartContext"
import { FaHome } from "react-icons/fa"
import woman1 from "../assets/woman1.webp"
import woman3 from "../assets/woman3.jpg"
import woman4 from "../assets/woman4.jpg"
import woman5 from "../assets/woman5.jpg"
import woman6 from "../assets/woman6.jpg"
import dress1 from "../assets/dress1.jpg"
import afrwear1 from "../assets/afrwear1.webp"
import afrwear2 from "../assets/Afrwear2.webp"
import wear5 from "../assets/wear5.jpg"
import wear6 from "../assets/wear6.jpg"
// WhatsApp img folder imports - Dresses
import waDress1 from "../assets/whatsapp img/dress1.jpeg"
import waDress2 from "../assets/whatsapp img/dress2.jpeg"
import waDress3 from "../assets/whatsapp img/dress3.jpeg"
import waDress4 from "../assets/whatsapp img/dress4.jpeg"
import waDress5 from "../assets/whatsapp img/dress5.jpeg"
import waDress6 from "../assets/whatsapp img/dress6.jpeg"
import waDress7 from "../assets/whatsapp img/dress7.jpeg"
import waDress8 from "../assets/whatsapp img/dress8.jpeg"
import waDress9 from "../assets/whatsapp img/dress9.jpeg"
import waDress10 from "../assets/whatsapp img/dress10.jpeg"
import waDress11 from "../assets/whatsapp img/dress11.jpeg"
// WhatsApp img folder imports - Bags
import waBag1 from "../assets/whatsapp img/bag1.jpeg"
import waBag2 from "../assets/whatsapp img/bag2.jpeg"
import waBag3 from "../assets/whatsapp img/bag3.jpeg"
import waBag4 from "../assets/whatsapp img/bag4.jpeg"
import waBag6 from "../assets/whatsapp img/bag6.jpeg"
import waBag7 from "../assets/whatsapp img/bag7.jpeg"
import waBag8 from "../assets/whatsapp img/bag8.jpeg"
// WhatsApp img folder imports - Braids
import waBraid1 from "../assets/whatsapp img/braid1.jpeg"
import waBraid2 from "../assets/whatsapp img/braid2.jpeg"
import waBraid3 from "../assets/whatsapp img/braid3.jpeg"
import waBraid4 from "../assets/whatsapp img/braid4.jpeg"
import waBraid5 from "../assets/whatsapp img/braid5.jpeg"
import waBraid6 from "../assets/whatsapp img/braid6.jpeg"
import waBraid7 from "../assets/whatsapp img/braid7.jpeg"
import waBraid8 from "../assets/whatsapp img/braid8.jpeg"
import waBraid9 from "../assets/whatsapp img/braid9.jpeg"

// Default women products
const defaultWomenProducts = [
    { id: 1, name: "Summer Dress", price: 39.99, originalPrice: 54.99, category: "dresses", sizes: ["XS", "S", "M", "L", "XL"], image: dress1, productId: "default-w1" },
    { id: 2, name: "African Print Ankara", price: 79.99, originalPrice: 99.99, category: "dresses", sizes: ["XS", "S", "M", "L", "XL"], image: afrwear1, productId: "default-w2" },
    { id: 3, name: "Traditional Wear", price: 89.99, originalPrice: 119.99, category: "dresses", sizes: ["XS", "S", "M", "L", "XL"], image: afrwear2, productId: "default-w3" },
    { id: 4, name: "Wrap Dress", price: 45.99, originalPrice: 59.99, category: "dresses", sizes: ["XS", "S", "M", "L", "XL"], image: woman4, productId: "default-w4" },
    { id: 5, name: "Casual Wear", price: 34.99, originalPrice: 44.99, category: "topwear", sizes: ["XS", "S", "M", "L", "XL"], image: woman1, productId: "default-w5" },
    { id: 6, name: "Formal Attire", price: 59.99, originalPrice: 79.99, category: "topwear", sizes: ["XS", "S", "M", "L", "XL"], image: woman3, productId: "default-w6" },
    { id: 7, name: "Street Style", price: 44.99, originalPrice: 59.99, category: "topwear", sizes: ["XS", "S", "M", "L", "XL"], image: woman5, productId: "default-w7" },
    { id: 8, name: "Accessories", price: 19.99, originalPrice: 29.99, category: "accessories", sizes: ["One Size"], image: woman6, productId: "default-w8" },
    { id: 9, name: "Evening Gown", price: 89.99, originalPrice: 119.99, category: "dresses", sizes: ["XS", "S", "M", "L", "XL"], image: wear5, productId: "default-w9" },
    { id: 10, name: "Party Dress", price: 69.99, originalPrice: 89.99, category: "dresses", sizes: ["XS", "S", "M", "L", "XL"], image: wear6, productId: "default-w10" },
    // WhatsApp Dress Collection
    { id: 11, name: "Elegant Floral Dress", price: 59.99, originalPrice: 79.99, category: "dresses", sizes: ["XS", "S", "M", "L", "XL"], image: waDress1, productId: "wa-w1" },
    { id: 12, name: "Classic Black Dress", price: 49.99, originalPrice: 69.99, category: "dresses", sizes: ["XS", "S", "M", "L", "XL"], image: waDress2, productId: "wa-w2" },
    { id: 13, name: "Summer Vibes Dress", price: 39.99, originalPrice: 54.99, category: "dresses", sizes: ["XS", "S", "M", "L", "XL"], image: waDress3, productId: "wa-w3" },
    { id: 14, name: "Bohemian Style Dress", price: 55.99, originalPrice: 75.99, category: "dresses", sizes: ["XS", "S", "M", "L", "XL"], image: waDress4, productId: "wa-w4" },
    { id: 15, name: "African Print Dress", price: 89.99, originalPrice: 119.99, category: "dresses", sizes: ["XS", "S", "M", "L", "XL"], image: waDress5, productId: "wa-w5" },
    { id: 16, name: "Evening Elegance", price: 99.99, originalPrice: 129.99, category: "dresses", sizes: ["XS", "S", "M", "L", "XL"], image: waDress6, productId: "wa-w6" },
    { id: 17, name: "Cocktail Dress", price: 79.99, originalPrice: 99.99, category: "dresses", sizes: ["XS", "S", "M", "L", "XL"], image: waDress7, productId: "wa-w7" },
    { id: 18, name: "Maxi Dress", price: 65.99, originalPrice: 85.99, category: "dresses", sizes: ["XS", "S", "M", "L", "XL"], image: waDress8, productId: "wa-w8" },
    { id: 19, name: "Casual Day Dress", price: 45.99, originalPrice: 59.99, category: "dresses", sizes: ["XS", "S", "M", "L", "XL"], image: waDress9, productId: "wa-w9" },
    { id: 20, name: "Party Collection Dress", price: 74.99, originalPrice: 94.99, category: "dresses", sizes: ["XS", "S", "M", "L", "XL"], image: waDress10, productId: "wa-w10" },
    { id: 21, name: "Designer Dress", price: 85.99, originalPrice: 109.99, category: "dresses", sizes: ["XS", "S", "M", "L", "XL"], image: waDress11, productId: "wa-w11" },
    // WhatsApp Bags Collection
    { id: 22, name: "Leather Handbag", price: 49.99, originalPrice: 69.99, category: "accessories", sizes: ["One Size"], image: waBag1, productId: "wa-b1" },
    { id: 23, name: "Designer Bag", price: 59.99, originalPrice: 79.99, category: "accessories", sizes: ["One Size"], image: waBag2, productId: "wa-b2" },
    { id: 24, name: "Elegant Clutch", price: 39.99, originalPrice: 54.99, category: "accessories", sizes: ["One Size"], image: waBag3, productId: "wa-b3" },
    { id: 25, name: "Fashion Tote Bag", price: 44.99, originalPrice: 59.99, category: "accessories", sizes: ["One Size"], image: waBag4, productId: "wa-b4" },
    { id: 26, name: "Evening Purse", price: 34.99, originalPrice: 49.99, category: "accessories", sizes: ["One Size"], image: waBag6, productId: "wa-b5" },
    { id: 27, name: "Luxury Bag", price: 79.99, originalPrice: 99.99, category: "accessories", sizes: ["One Size"], image: waBag7, productId: "wa-b6" },
    { id: 28, name: "Style Bag", price: 54.99, originalPrice: 74.99, category: "accessories", sizes: ["One Size"], image: waBag8, productId: "wa-b7" },
    // WhatsApp Braids Collection
    { id: 29, name: "Braided Hair Style 1", price: 29.99, originalPrice: 39.99, category: "accessories", sizes: ["One Size"], image: waBraid1, productId: "wa-br1" },
    { id: 30, name: "Braided Hair Style 2", price: 29.99, originalPrice: 39.99, category: "accessories", sizes: ["One Size"], image: waBraid2, productId: "wa-br2" },
    { id: 31, name: "Braided Hair Style 3", price: 34.99, originalPrice: 44.99, category: "accessories", sizes: ["One Size"], image: waBraid3, productId: "wa-br3" },
    { id: 32, name: "Braided Hair Style 4", price: 29.99, originalPrice: 39.99, category: "accessories", sizes: ["One Size"], image: waBraid4, productId: "wa-br4" },
    { id: 33, name: "Braided Hair Style 5", price: 24.99, originalPrice: 34.99, category: "accessories", sizes: ["One Size"], image: waBraid5, productId: "wa-br5" },
    { id: 34, name: "Braided Hair Style 6", price: 39.99, originalPrice: 49.99, category: "accessories", sizes: ["One Size"], image: waBraid6, productId: "wa-br6" },
    { id: 35, name: "Braided Hair Style 7", price: 34.99, originalPrice: 44.99, category: "accessories", sizes: ["One Size"], image: waBraid7, productId: "wa-br7" },
    { id: 36, name: "Braided Hair Style 8", price: 29.99, originalPrice: 39.99, category: "accessories", sizes: ["One Size"], image: waBraid8, productId: "wa-br8" },
    { id: 37, name: "Braided Hair Style 9", price: 32.99, originalPrice: 42.99, category: "accessories", sizes: ["One Size"], image: waBraid9, productId: "wa-br9" },
]

const WomenPage = () => {
    const showNotification = useNotification()
    const { addToCart } = useCart()
    const location = useLocation()
    const [addingProductId, setAddingProductId] = useState(null)
    const [womenProducts, setWomenProducts] = useState(defaultWomenProducts)
    const [selectedCategory, setSelectedCategory] = useState("all")
    
    // Determine current section based on pathname
    const getSectionTitle = () => {
        const path = location.pathname.toLowerCase()
        if (path === "/women") return "Women's Collection"
        if (path === "/dresses") return "Women's Dresses"
        if (path === "/accessories") return "Women's Accessories"
        if (selectedCategory === "all") return "Women's Collection"
        if (selectedCategory === "dresses") return "Women's Dresses"
        if (selectedCategory === "tops") return "Women's Tops"
        if (selectedCategory === "bottoms") return "Women's Bottoms"
        if (selectedCategory === "handbags") return "Women's Handbags"
        if (selectedCategory === "shoes") return "Women's Shoes"
        if (selectedCategory === "braces") return "Women's Braces"
        if (selectedCategory === "earrings") return "Women's Earrings"
        return "Women's Collection"
    }

    // Filter products by category
    const filteredProducts = selectedCategory === "all" 
        ? womenProducts 
        : womenProducts.filter(p => p.category === selectedCategory || p.category === "accessories")

    // Load products from localStorage
    useEffect(() => {
        const loadProducts = () => {
            try {
                const storedProducts = JSON.parse(localStorage.getItem("products") || "[]")
                if (storedProducts && storedProducts.length > 0) {
                    const transformedProducts = storedProducts
                        .filter(p => {
                            const cat = p.category?.toLowerCase()
                            return cat === "women" || cat === "dresses" || cat === "topwear" || cat === "accessories"
                        })
                        .map((p) => ({
                            ...p,
                            productId: p.id,
                            originalPrice: p.price * 1.2,
                            sizes: p.sizes && p.sizes.length > 0 ? p.sizes : ["XS", "S", "M", "L", "XL"]
                        }))
                    
                    const combined = [...transformedProducts, ...defaultWomenProducts]
                    const unique = combined.filter((item, index, self) => 
                        index === self.findIndex((t) => (t.productId || t.id) === (item.productId || item.id))
                    )
                    setWomenProducts(unique)
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
                size: product.sizes ? product.sizes[0] : "S",
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
                        onClick={() => setSelectedCategory("handbags")}
                        className={`px-4 py-2 rounded-lg ${selectedCategory === "handbags" ? "bg-red-600 text-white" : "bg-gray-900 text-white hover:bg-red-600"}`}
                    >
                        Handbags
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
                <h2 className="mb-8 text-xl text-center text-gray-600">Elegant African Fashion for Women</h2>
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

                {womenProducts.length === 0 && (
                    <div className="py-12 text-center">
                        <p className="text-lg text-gray-500">Products here will be posted soon, keep checking while we keep you posted.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default WomenPage
