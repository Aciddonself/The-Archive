import { useState, useEffect } from "react"
import { useNotification } from "../App"
import { useCart } from "../context/CartContext"
import man5 from "../assets/man5.webp"
import man7 from "../assets/man7.jpg"
import men2 from "../assets/men2.jpg"
import man1 from "../assets/man1.webp"
import dress1 from "../assets/dress1.jpg"
import afrwear1 from "../assets/afrwear1.webp"
import wear1 from "../assets/wear1.jpg"
import wear2 from "../assets/wear2.jpg"
import wear3 from "../assets/wear3.jpg"
// WhatsApp img folder imports - T-shirts
import waTsht1 from "../assets/whatsapp img/tsht1.jpeg"
import waTsht2 from "../assets/whatsapp img/tsht2.jpeg"
// WhatsApp img folder imports - Shoes
import waShoe1 from "../assets/whatsapp img/shoe1.jpeg"

// Default topwear products
const defaultTopwearProducts = [
    { id: 1, name: "Classic White Shirt", price: 29.99, originalPrice: 39.99, gender: "men", sizes: ["S", "M", "L", "XL"], image: man5, productId: "default-t1" },
    { id: 2, name: "Black Leather Jacket", price: 89.99, originalPrice: 119.99, gender: "men", sizes: ["S", "M", "L", "XL"], image: man7, productId: "default-t2" },
    { id: 3, name: "Executive Style", price: 74.99, originalPrice: 94.99, gender: "men", sizes: ["S", "M", "L", "XL"], image: men2, productId: "default-t3" },
    { id: 4, name: "Modern Menswear", price: 54.99, originalPrice: 74.99, gender: "men", sizes: ["S", "M", "L", "XL"], image: man1, productId: "default-t4" },
    { id: 5, name: "Summer Dress", price: 39.99, originalPrice: 54.99, gender: "women", sizes: ["XS", "S", "M", "L", "XL"], image: dress1, productId: "default-t5" },
    { id: 6, name: "African Print Ankara", price: 79.99, originalPrice: 99.99, gender: "women", sizes: ["XS", "S", "M", "L", "XL"], image: afrwear1, productId: "default-t6" },
    { id: 7, name: "Casual Wear", price: 34.99, originalPrice: 44.99, gender: "women", sizes: ["XS", "S", "M", "L", "XL"], image: wear1, productId: "default-t7" },
    { id: 8, name: "Formal Attire", price: 59.99, originalPrice: 79.99, gender: "women", sizes: ["XS", "S", "M", "L", "XL"], image: wear2, productId: "default-t8" },
    // WhatsApp T-shirt Collection
    { id: 9, name: "Casual T-Shirt", price: 24.99, originalPrice: 34.99, gender: "men", sizes: ["S", "M", "L", "XL"], image: waTsht1, productId: "wa-t1" },
    { id: 10, name: "Graphic Tee", price: 29.99, originalPrice: 39.99, gender: "men", sizes: ["S", "M", "L", "XL"], image: waTsht2, productId: "wa-t2" },
    // WhatsApp Shoe Collection
    { id: 11, name: "Fashion Sneakers", price: 69.99, originalPrice: 89.99, gender: "unisex", sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44"], image: waShoe1, productId: "wa-s1" },
]

const TopwearPage = () => {
    const showNotification = useNotification()
    const { addToCart } = useCart()
    const [addingProductId, setAddingProductId] = useState(null)
    const [topwearProducts, setTopwearProducts] = useState(defaultTopwearProducts)

    // Load products from localStorage
    useEffect(() => {
        const loadProducts = () => {
            try {
                const storedProducts = JSON.parse(localStorage.getItem("products") || "[]")
                if (storedProducts && storedProducts.length > 0) {
                    const transformedProducts = storedProducts
                        .filter(p => p.category?.toLowerCase() === "topwear")
                        .map((p) => ({
                            ...p,
                            productId: p.id,
                            originalPrice: p.price * 1.2,
                            sizes: p.sizes && p.sizes.length > 0 ? p.sizes : ["S", "M", "L", "XL"]
                        }))
                    
                    const combined = [...transformedProducts, ...defaultTopwearProducts]
                    const unique = combined.filter((item, index, self) => 
                        index === self.findIndex((t) => (t.productId || t.id) === (item.productId || item.id))
                    )
                    setTopwearProducts(unique)
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
                <h1 className="mb-8 text-3xl font-bold text-center">Topwear Collection</h1>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {topwearProducts.map((product) => (
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

                {topwearProducts.length === 0 && (
                    <div className="py-12 text-center">
                        <p className="text-lg text-gray-500">Products here will be posted soon, keep checking while we keep you posted.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TopwearPage
