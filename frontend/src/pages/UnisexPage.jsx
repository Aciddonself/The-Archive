import { useState, useEffect } from "react"
import { useLocation, Link } from "react-router-dom"
import { useNotification } from "../App"
import { useCart } from "../context/CartContext"
import { FaHome } from "react-icons/fa"

// Import all product images
import man1 from "../assets/man1.webp"
import man3 from "../assets/man3.jpg"
import man5 from "../assets/man5.webp"
import man6 from "../assets/man6.jpg"
import man7 from "../assets/man7.jpg"
import men2 from "../assets/men2.jpg"
import woman1 from "../assets/woman1.webp"
import woman3 from "../assets/woman3.jpg"
import woman4 from "../assets/woman4.jpg"
import woman5 from "../assets/woman5.jpg"
import woman6 from "../assets/woman6.jpg"
import dress1 from "../assets/dress1.jpg"
import afrwear1 from "../assets/afrwear1.webp"
import afrwear2 from "../assets/Afrwear2.webp"
import wear1 from "../assets/wear1.jpg"
import wear2 from "../assets/wear2.jpg"
import wear3 from "../assets/wear3.jpg"
import wear5 from "../assets/wear5.jpg"
import wear6 from "../assets/wear6.jpg"
import kenya from "../assets/kenya.jpg"
import ug1 from "../assets/ug1.webp"
import ug2 from "../assets/ug2.jpg"
import ug3 from "../assets/ug3.jpg"
import kid1 from "../assets/kid1.webp"
import kid2 from "../assets/kid2.webp"
import kid3 from "../assets/kid3.webp"
import kid4 from "../assets/kid4.webp"
import kid5 from "../assets/kid5.webp"
import kid6 from "../assets/kid6.webp"
import kid7 from "../assets/kid7.webp"

// WhatsApp imports - Bags
import waBag1 from "../assets/whatsapp img/bag1.jpeg"
import waBag2 from "../assets/whatsapp img/bag2.jpeg"
import waBag3 from "../assets/whatsapp img/bag3.jpeg"
import waBag4 from "../assets/whatsapp img/bag4.jpeg"
import waBag6 from "../assets/whatsapp img/bag6.jpeg"
import waBag7 from "../assets/whatsapp img/bag7.jpeg"
import waBag8 from "../assets/whatsapp img/bag8.jpeg"

// WhatsApp imports - Shoes
import waShoe1 from "../assets/whatsapp img/shoe1.jpeg"
import waTsht1 from "../assets/whatsapp img/tsht1.jpeg"
import waTsht2 from "../assets/whatsapp img/tsht2.jpeg"

// WhatsApp imports - Dresses
import waDress1 from "../assets/whatsapp img/dress1.jpeg"
import waDress5 from "../assets/whatsapp img/dress5.jpeg"
import waDress7 from "../assets/whatsapp img/dress7.jpeg"
import waDress10 from "../assets/whatsapp img/dress10.jpeg"

// WhatsApp imports - Braids
import waBraid1 from "../assets/whatsapp img/braid1.jpeg"
import waBraid5 from "../assets/whatsapp img/braid5.jpeg"
import waBraid9 from "../assets/whatsapp img/braid9.jpeg"

// All unisex products - combining men, women, and kids items
const allUnisexProducts = [
    // Men items
    { id: 1, name: "Classic White Shirt", price: 29.99, originalPrice: 39.99, category: "tops", gender: "men", sizes: ["S", "M", "L", "XL"], image: man5, productId: "uni-1" },
    { id: 2, name: "Black Leather Jacket", price: 89.99, originalPrice: 119.99, category: "tops", gender: "men", sizes: ["S", "M", "L", "XL"], image: man7, productId: "uni-2" },
    { id: 3, name: "Executive Style", price: 74.99, originalPrice: 94.99, category: "tops", gender: "men", sizes: ["S", "M", "L", "XL"], image: men2, productId: "uni-3" },
    { id: 4, name: "Modern Menswear", price: 54.99, originalPrice: 74.99, category: "tops", gender: "men", sizes: ["S", "M", "L", "XL"], image: man1, productId: "uni-4" },
    { id: 5, name: "Casual Denim", price: 44.99, originalPrice: 59.99, category: "bottoms", gender: "men", sizes: ["28", "30", "32", "34"], image: ug3, productId: "uni-5" },
    { id: 6, name: "Blue Denim Jeans", price: 49.99, originalPrice: 69.99, category: "bottoms", gender: "men", sizes: ["28", "30", "32", "34"], image: kenya, productId: "uni-6" },
    { id: 7, name: "Kenya Safari Wear", price: 39.99, originalPrice: 49.99, category: "tops", gender: "men", sizes: ["S", "M", "L", "XL"], image: kenya, productId: "uni-7" },
    { id: 8, name: "Uganda Traditional", price: 59.99, originalPrice: 79.99, category: "tops", gender: "men", sizes: ["S", "M", "L", "XL"], image: ug1, productId: "uni-8" },
    
    // Women items
    { id: 9, name: "Summer Dress", price: 39.99, originalPrice: 54.99, category: "dresses", gender: "women", sizes: ["XS", "S", "M", "L", "XL"], image: dress1, productId: "uni-9" },
    { id: 10, name: "African Print Ankara", price: 79.99, originalPrice: 99.99, category: "dresses", gender: "women", sizes: ["XS", "S", "M", "L", "XL"], image: afrwear1, productId: "uni-10" },
    { id: 11, name: "Traditional Wear", price: 89.99, originalPrice: 119.99, category: "dresses", gender: "women", sizes: ["XS", "S", "M", "L", "XL"], image: afrwear2, productId: "uni-11" },
    { id: 12, name: "Wrap Dress", price: 45.99, originalPrice: 59.99, category: "dresses", gender: "women", sizes: ["XS", "S", "M", "L", "XL"], image: woman4, productId: "uni-12" },
    { id: 13, name: "Casual Wear", price: 34.99, originalPrice: 44.99, category: "tops", gender: "women", sizes: ["XS", "S", "M", "L", "XL"], image: woman1, productId: "uni-13" },
    { id: 14, name: "Formal Attire", price: 59.99, originalPrice: 79.99, category: "tops", gender: "women", sizes: ["XS", "S", "M", "L", "XL"], image: woman3, productId: "uni-14" },
    { id: 15, name: "Evening Gown", price: 89.99, originalPrice: 119.99, category: "dresses", gender: "women", sizes: ["XS", "S", "M", "L", "XL"], image: wear5, productId: "uni-15" },
    { id: 16, name: "Party Dress", price: 69.99, originalPrice: 89.99, category: "dresses", gender: "women", sizes: ["XS", "S", "M", "L", "XL"], image: wear6, productId: "uni-16" },
    
    // Shoes (unisex)
    { id: 17, name: "Fashion Sneakers", price: 69.99, originalPrice: 89.99, category: "shoes", gender: "unisex", sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44"], image: waShoe1, productId: "uni-17" },
    
    // Bags (women accessories)
    { id: 18, name: "Leather Handbag", price: 49.99, originalPrice: 69.99, category: "handbags", gender: "women", sizes: ["One Size"], image: waBag1, productId: "uni-18" },
    { id: 19, name: "Designer Bag", price: 59.99, originalPrice: 79.99, category: "handbags", gender: "women", sizes: ["One Size"], image: waBag2, productId: "uni-19" },
    { id: 20, name: "Elegant Clutch", price: 39.99, originalPrice: 54.99, category: "handbags", gender: "women", sizes: ["One Size"], image: waBag3, productId: "uni-20" },
    { id: 21, name: "Fashion Tote Bag", price: 44.99, originalPrice: 59.99, category: "handbags", gender: "women", sizes: ["One Size"], image: waBag4, productId: "uni-21" },
    
    // T-shirts
    { id: 22, name: "Casual T-Shirt", price: 24.99, originalPrice: 34.99, category: "tops", gender: "men", sizes: ["S", "M", "L", "XL"], image: waTsht1, productId: "uni-22" },
    { id: 23, name: "Graphic Tee", price: 29.99, originalPrice: 39.99, category: "tops", gender: "men", sizes: ["S", "M", "L", "XL"], image: waTsht2, productId: "uni-23" },
    
    // WhatsApp Dresses
    { id: 24, name: "Elegant Floral Dress", price: 59.99, originalPrice: 79.99, category: "dresses", gender: "women", sizes: ["XS", "S", "M", "L", "XL"], image: waDress1, productId: "uni-24" },
    { id: 25, name: "African Print Dress", price: 89.99, originalPrice: 119.99, category: "dresses", gender: "women", sizes: ["XS", "S", "M", "L", "XL"], image: waDress5, productId: "uni-25" },
    { id: 26, name: "Designer Evening Gown", price: 79.99, originalPrice: 99.99, category: "dresses", gender: "women", sizes: ["XS", "S", "M", "L", "XL"], image: waDress7, productId: "uni-26" },
    { id: 27, name: "Party Collection Dress", price: 74.99, originalPrice: 94.99, category: "dresses", gender: "women", sizes: ["XS", "S", "M", "L", "XL"], image: waDress10, productId: "uni-27" },
    
    // Kids items
    { id: 28, name: "Kids African Print", price: 24.99, originalPrice: 34.99, category: "tops", gender: "kids", sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], image: kid1, productId: "uni-28" },
    { id: 29, name: "Kids Denim Jeans", price: 19.99, originalPrice: 29.99, category: "bottoms", gender: "kids", sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], image: kid2, productId: "uni-29" },
    { id: 30, name: "Kids Party Dress", price: 29.99, originalPrice: 39.99, category: "dresses", gender: "kids", sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], image: kid3, productId: "uni-30" },
    { id: 31, name: "Kids Ankara Set", price: 34.99, originalPrice: 44.99, category: "tops", gender: "kids", sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], image: kid4, productId: "uni-31" },
]

const UnisexPage = () => {
    const showNotification = useNotification()
    const { addToCart } = useCart()
    const location = useLocation()
    const [addingProductId, setAddingProductId] = useState(null)
    const [unisexProducts, setUnisexProducts] = useState(allUnisexProducts)
    const [selectedCategory, setSelectedCategory] = useState("all")
    
    // Determine current section based on pathname
    const getSectionTitle = () => {
        const path = location.pathname.toLowerCase()
        if (selectedCategory === "all") return "Unisex Collection"
        if (selectedCategory === "dresses") return "Unisex Dresses"
        if (selectedCategory === "tops") return "Unisex Tops"
        if (selectedCategory === "bottoms") return "Unisex Bottoms"
        if (selectedCategory === "shoes") return "Unisex Shoes"
        if (selectedCategory === "handbags") return "Unisex Handbags"
        return "Unisex Collection"
    }
    
    // Filter products by category
    const filteredProducts = selectedCategory === "all" 
        ? unisexProducts 
        : unisexProducts.filter(p => p.category === selectedCategory)

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
                    <button 
                        onClick={() => setSelectedCategory("handbags")}
                        className={`px-4 py-2 rounded-lg ${selectedCategory === "handbags" ? "bg-red-600 text-white" : "bg-gray-900 text-white hover:bg-red-600"}`}
                    >
                        Handbags
                    </button>
                </div>

                <h1 className="mb-2 text-3xl font-bold text-center">{getSectionTitle()}</h1>
                <h2 className="mb-8 text-xl text-center text-gray-600">Unisex African Fashion for Everyone</h2>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {filteredProducts.map((product) => (
                        <div key={product.productId || product.id} className="overflow-hidden transition-shadow bg-white rounded-lg shadow-md hover:shadow-xl">
                            <div className="overflow-hidden group">
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="object-cover w-full h-64 transition-transform duration-300 group-hover:scale-110" 
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold">{product.name}</h3>
                                <p className="text-gray-600 capitalize">{product.category} - {product.gender}</p>
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

                {filteredProducts.length === 0 && (
                    <div className="py-12 text-center">
                        <p className="text-lg text-gray-500">Products here will be posted soon, keep checking while we keep you posted.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UnisexPage
