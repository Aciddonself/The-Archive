import { useState, useMemo, useEffect } from "react"
import { useNotification } from "../App"
import { useCart } from "../context/CartContext"
import { insforge } from "../lib/insforge"
import man1 from "../assets/man1.webp"
import man3 from "../assets/man3.jpg"
import man5 from "../assets/man5.webp"
import man6 from "../assets/man6.jpg"
import man7 from "../assets/man7.jpg"
import men2 from "../assets/men2.jpg"
import dress1 from "../assets/dress1.jpg"
import afrwear1 from "../assets/afrwear1.webp"
import afrwear2 from "../assets/Afrwear2.webp"
import afrwear4 from "../assets/afrwear4.jpg"
import wear1 from "../assets/wear1.jpg"
import wear2 from "../assets/wear2.jpg"
import wear3 from "../assets/wear3.jpg"
import wear4 from "../assets/wear4.jpg"
import wear5 from "../assets/wear5.jpg"
import wear6 from "../assets/wear6.jpg"
import wear7 from "../assets/wear7.jpg"
import hat from "../assets/hat.jpg"

// Default products (fallback when no products in localStorage)
const defaultProducts = [
    // Men
    { id: 1, name: "Classic White Shirt", price: 29.99, originalPrice: 39.99, gender: "men", category: "topwear", sizes: ["S", "M", "L", "XL"], image: man5, productId: "default-1" },
    { id: 2, name: "Blue Denim Jeans", price: 49.99, originalPrice: 69.99, gender: "men", category: "bottoms", sizes: ["28", "30", "32", "34"], image: man6, productId: "default-2" },
    { id: 3, name: "Black Leather Jacket", price: 89.99, originalPrice: 119.99, gender: "men", category: "topwear", sizes: ["S", "M", "L", "XL"], image: man7, productId: "default-3" },
    { id: 4, name: "Executive Style", price: 74.99, originalPrice: 94.99, gender: "men", category: "topwear", sizes: ["S", "M", "L", "XL"], image: men2, productId: "default-4" },
    { id: 5, name: "Modern Menswear", price: 54.99, originalPrice: 74.99, gender: "men", category: "topwear", sizes: ["S", "M", "L", "XL"], image: man1, productId: "default-5" },
    { id: 6, name: "Casual Denim", price: 44.99, originalPrice: 59.99, gender: "men", category: "bottoms", sizes: ["28", "30", "32", "34"], image: man3, productId: "default-6" },
    
    // Women
    { id: 7, name: "Summer Dress", price: 39.99, originalPrice: 54.99, gender: "women", category: "dresses", sizes: ["XS", "S", "M", "L", "XL"], image: dress1, productId: "default-7" },
    { id: 8, name: "African Print Ankara", price: 79.99, originalPrice: 99.99, gender: "women", category: "dresses", sizes: ["XS", "S", "M", "L", "XL"], image: afrwear1, productId: "default-8" },
    { id: 9, name: "Traditional Wear", price: 89.99, originalPrice: 119.99, gender: "women", category: "dresses", sizes: ["XS", "S", "M", "L", "XL"], image: afrwear2, productId: "default-9" },
    { id: 10, name: "Wrap Dress", price: 45.99, originalPrice: 59.99, gender: "women", category: "dresses", sizes: ["XS", "S", "M", "L", "XL"], image: afrwear4, productId: "default-10" },
    { id: 11, name: "Casual Wear", price: 34.99, originalPrice: 44.99, gender: "women", category: "topwear", sizes: ["XS", "S", "M", "L", "XL"], image: wear1, productId: "default-11" },
    { id: 12, name: "Formal Attire", price: 59.99, originalPrice: 79.99, gender: "women", category: "topwear", sizes: ["XS", "S", "M", "L", "XL"], image: wear2, productId: "default-12" },
    { id: 13, name: "Street Style", price: 44.99, originalPrice: 59.99, gender: "women", category: "topwear", sizes: ["XS", "S", "M", "L", "XL"], image: wear3, productId: "default-13" },
    { id: 14, name: "Accessories", price: 19.99, originalPrice: 29.99, gender: "women", category: "accessories", sizes: ["One Size"], image: wear4, productId: "default-14" },
    
    // Kids
    { id: 15, name: "Kids African Print", price: 24.99, originalPrice: 34.99, gender: "kids", category: "topwear", sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], image: man5, productId: "default-15" },
    { id: 16, name: "Kids Denim Jeans", price: 19.99, originalPrice: 29.99, gender: "kids", category: "bottoms", sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], image: man6, productId: "default-16" },
    { id: 17, name: "Kids Party Dress", price: 29.99, originalPrice: 39.99, gender: "kids", category: "dresses", sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], image: dress1, productId: "default-17" },
    { id: 18, name: "Kids Ankara Set", price: 34.99, originalPrice: 44.99, gender: "kids", category: "topwear", sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], image: afrwear1, productId: "default-18" },
]

const ShopPage = () => {
    const showNotification = useNotification()
    const { addToCart } = useCart()
    const [addingProductId, setAddingProductId] = useState(null)
    const [selectedGender, setSelectedGender] = useState("all")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [selectedSize, setSelectedSize] = useState("all")
    const [sortBy, setSortBy] = useState("default")
    const [priceRange, setPriceRange] = useState({ min: "", max: "" })
    const [selectedColor, setSelectedColor] = useState("all")
    const [showFilters, setShowFilters] = useState(false)
    const [allProducts, setAllProducts] = useState(defaultProducts)

    // Load products from InsForge database on mount, fallback to localStorage and default products
    useEffect(() => {
        const loadProducts = async () => {
            try {
                // Try to fetch from database first
                const { data: dbProducts, error } = await insforge
                    .from('products')
                    .select('*')
                    .eq('is_active', true)
                    .order('created_at', { ascending: false })
                
                if (dbProducts && dbProducts.length > 0) {
                    // Transform database products to match the format needed
                    const transformedProducts = dbProducts.map((p) => ({
                        ...p,
                        productId: p.id,
                        name: p.name,
                        price: parseFloat(p.price),
                        originalPrice: p.price * 1.2,
                        category: p.category,
                        gender: getGenderFromCategory(p.category),
                        image: p.image_url || p.image,
                        description: p.description,
                        sizes: ["S", "M", "L", "XL"]
                    }))
                    // Combine: database products first, then default products
                    setAllProducts([...transformedProducts, ...defaultProducts])
                } else {
                    // Fallback to localStorage if no database products
                    const storedProducts = JSON.parse(localStorage.getItem("products") || "[]")
                    if (storedProducts && storedProducts.length > 0) {
                        // Transform stored products to match the format needed
                        const transformedProducts = storedProducts.map((p, index) => ({
                            ...p,
                            productId: p.id,
                            gender: getGenderFromCategory(p.category),
                            originalPrice: p.price * 1.2, // Add 20% markup for original price
                            sizes: p.sizes && p.sizes.length > 0 ? p.sizes : ["S", "M", "L", "XL"]
                        }))
                        // Combine: stored products first, then default products
                        setAllProducts([...transformedProducts, ...defaultProducts])
                    }
                }
            } catch (error) {
                console.error("Error loading products from database:", error)
                // Fallback to localStorage on error
                try {
                    const storedProducts = JSON.parse(localStorage.getItem("products") || "[]")
                    if (storedProducts && storedProducts.length > 0) {
                        const transformedProducts = storedProducts.map((p, index) => ({
                            ...p,
                            productId: p.id,
                            gender: getGenderFromCategory(p.category),
                            originalPrice: p.price * 1.2,
                            sizes: p.sizes && p.sizes.length > 0 ? p.sizes : ["S", "M", "L", "XL"]
                        }))
                        setAllProducts([...transformedProducts, ...defaultProducts])
                    }
                } catch (e) {
                    console.error("Error loading products from localStorage:", e)
                }
            }
        }
        loadProducts()
    }, [])

    // Helper function to determine gender from category
    const getGenderFromCategory = (category) => {
        const menCategories = ["men", "topwear", "bottoms"]
        const womenCategories = ["women", "dresses", "topwear"]
        const kidsCategories = ["kids"]
        
        const cat = category?.toLowerCase()
        if (menCategories.includes(cat)) return "men"
        if (womenCategories.includes(cat)) return "women"
        if (kidsCategories.includes(cat)) return "kids"
        return "all"
    }

    // Filter products
    const filteredProducts = useMemo(() => {
        let result = [...allProducts]

        // Filter by gender
        if (selectedGender !== "all") {
            result = result.filter(p => p.gender === selectedGender)
        }

        // Filter by category
        if (selectedCategory !== "all") {
            result = result.filter(p => p.category === selectedCategory)
        }

        // Filter by size
        if (selectedSize !== "all") {
            result = result.filter(p => p.sizes && p.sizes.includes(selectedSize))
        }

        // Filter by price range
        if (priceRange.min) {
            result = result.filter(p => p.price >= parseFloat(priceRange.min))
        }
        if (priceRange.max) {
            result = result.filter(p => p.price <= parseFloat(priceRange.max))
        }

        // Filter by color
        if (selectedColor !== "all") {
            result = result.filter(p => p.colors && p.colors.map(c => c.toLowerCase()).includes(selectedColor.toLowerCase()))
        }

        // Sort
        if (sortBy === "price-low") {
            result.sort((a, b) => a.price - b.price)
        } else if (sortBy === "price-high") {
            result.sort((a, b) => b.price - a.price)
        }

        return result
    }, [allProducts, selectedGender, selectedCategory, selectedSize, sortBy, priceRange, selectedColor])

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

    // Get unique categories, sizes, and colors from products
    const categories = [...new Set(allProducts.map(p => p.category).filter(Boolean))]
    const sizes = [...new Set(allProducts.flatMap(p => p.sizes || []).filter(Boolean))]
    const colors = [...new Set(allProducts.flatMap(p => p.colors || []).filter(Boolean))]

    return (
        <div className="container px-4 py-8 mx-auto">
            <h1 className="mb-8 text-3xl font-bold text-center">Shop</h1>
            
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
                <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="w-full px-4 py-2 text-white bg-gray-800 rounded-lg"
                >
                    {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
            </div>

            {/* Filters */}
            <div className={`flex flex-wrap justify-center gap-4 mb-8 ${showFilters || 'hidden lg:flex'}`}>
                <select 
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                    <option value="all">All Genders</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                </select>

                <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                    <option value="all">All Categories</option>
                    <option value="topwear">Topwear</option>
                    <option value="bottoms">Bottoms</option>
                    <option value="dresses">Dresses</option>
                    <option value="accessories">Accessories</option>
                </select>

                <select 
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                    <option value="all">All Sizes</option>
                    {sizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                    ))}
                </select>

                <select 
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                    <option value="all">All Colors</option>
                    {colors.map(color => (
                        <option key={color} value={color}>{color}</option>
                    ))}
                </select>

                {/* Price Range */}
                <div className="flex items-center gap-2">
                    <input 
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        className="w-20 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                    <span className="text-gray-500">-</span>
                    <input 
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        className="w-20 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                </div>

                <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                    <option value="default">Sort By</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                </select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map(product => (
                    <div key={product.productId || product.id} className="overflow-hidden transition-shadow bg-white rounded-lg shadow-md hover:shadow-xl">
                        <div className="relative overflow-hidden group">
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                className="object-cover w-full h-64 transition-transform duration-300 transform group-hover:scale-110"
                            />
                            {product.originalPrice > product.price && (
                                <span className="absolute px-2 py-1 text-xs font-bold text-white bg-red-600 rounded top-2 right-2">
                                    SALE
                                </span>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="mb-1 text-lg font-semibold">{product.name}</h3>
                            <p className="mb-2 text-sm text-gray-500">{product.category}</p>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xl font-bold text-red-600">${product.price.toFixed(2)}</span>
                                {product.originalPrice > product.price && (
                                    <span className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                                )}
                            </div>
                            <button
                                onClick={() => handleAddToCart(product)}
                                disabled={addingProductId === product.productId}
                                className="w-full py-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                            >
                                {addingProductId === product.productId ? "Adding..." : "Add to Cart"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="py-12 text-center">
                    <p className="text-lg text-gray-500">No products found</p>
                    <p className="text-gray-400">Try adjusting your filters</p>
                </div>
            )}
        </div>
    )
}

export default ShopPage
