import { useState } from "react"
import { useNotification } from "../../App"
import { useCart } from "../../context/CartContext"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import dress1 from "../../assets/dress1.jpg"
import man1 from "../../assets/man1.webp"
import afrwear1 from "../../assets/afrwear1.webp"
import afrwear2 from "../../assets/Afrwear2.webp"
import man3 from "../../assets/man3.jpg"
import men2 from "../../assets/men2.jpg"
import woman4 from "../../assets/woman4.jpg"
import woman5 from "../../assets/woman5.jpg"
import kenya from "../../assets/kenya.jpg"
import ug2 from "../../assets/ug2.jpg"
// WhatsApp img imports
import waDress1 from "../../assets/whatsapp img/dress1.jpeg"
import waDress2 from "../../assets/whatsapp img/dress2.jpeg"
import waDress5 from "../../assets/whatsapp img/dress5.jpeg"
import waDress6 from "../../assets/whatsapp img/dress6.jpeg"
import waDress7 from "../../assets/whatsapp img/dress7.jpeg"
import waDress8 from "../../assets/whatsapp img/dress8.jpeg"
import waDress9 from "../../assets/whatsapp img/dress9.jpeg"
import waDress10 from "../../assets/whatsapp img/dress10.jpeg"
import waDress11 from "../../assets/whatsapp img/dress11.jpeg"
import waBag1 from "../../assets/whatsapp img/bag1.jpeg"
import waBag2 from "../../assets/whatsapp img/bag2.jpeg"
import waBag3 from "../../assets/whatsapp img/bag3.jpeg"
import waBag4 from "../../assets/whatsapp img/bag4.jpeg"
import waBag6 from "../../assets/whatsapp img/bag6.jpeg"
import waBag7 from "../../assets/whatsapp img/bag7.jpeg"
import waBag8 from "../../assets/whatsapp img/bag8.jpeg"
import waBraid1 from "../../assets/whatsapp img/braid1.jpeg"
import waBraid2 from "../../assets/whatsapp img/braid2.jpeg"
import waBraid3 from "../../assets/whatsapp img/braid3.jpeg"
import waBraid4 from "../../assets/whatsapp img/braid4.jpeg"
import waBraid5 from "../../assets/whatsapp img/braid5.jpeg"
import waBraid6 from "../../assets/whatsapp img/braid6.jpeg"
import waBraid7 from "../../assets/whatsapp img/braid7.jpeg"
import waBraid8 from "../../assets/whatsapp img/braid8.jpeg"
import waBraid9 from "../../assets/whatsapp img/braid9.jpeg"
import waShoe1 from "../../assets/whatsapp img/shoe1.jpeg"
import waTsht1 from "../../assets/whatsapp img/tsht1.jpeg"
import waTsht2 from "../../assets/whatsapp img/tsht2.jpeg"

const FeaturedCollection = () => {
    const showNotification = useNotification()
    const { addToCart } = useCart()
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [addingProductId, setAddingProductId] = useState(null)

    const featuredProducts = [
        {
            productId: 301,
            name: "Traditional Ankle Length Dress",
            description: "Authentic African print dress perfect for ceremonies and celebrations",
            price: 89.99,
            originalPrice: 119.99,
            image: dress1,
            altText: "Traditional Ankle Length Dress",
            category: "Women"
        },
        {
            productId: 302,
            name: "Classic Men's Agbada",
            description: "Traditional Nigerian men's wear for special occasions",
            price: 129.99,
            originalPrice: 159.99,
            image: man1,
            altText: "Classic Men's Agbada",
            category: "Men"
        },
        {
            productId: 303,
            name: "Modern Ankara Gown",
            description: "Contemporary style gown with vibrant Ankara prints",
            price: 79.99,
            originalPrice: 99.99,
            image: afrwear1,
            altText: "Modern Ankara Gown",
            category: "Women"
        },
        {
            productId: 304,
            name: "Executive Men's Suit",
            description: "Elegant suit perfect for business meetings",
            price: 149.99,
            originalPrice: 199.99,
            image: men2,
            altText: "Executive Men's Suit",
            category: "Men"
        },
        {
            productId: 305,
            name: "Premium African Print Dress",
            description: "Stunning premium dress with authentic African prints",
            price: 89.99,
            originalPrice: 119.99,
            image: waDress5,
            altText: "Premium African Print Dress",
            category: "Women"
        },
        {
            productId: 306,
            name: "Designer Evening Gown",
            description: "Beautiful evening gown for special events",
            price: 94.99,
            originalPrice: 124.99,
            image: waDress7,
            altText: "Designer Evening Gown",
            category: "Women"
        },
        {
            productId: 307,
            name: "Luxury Handbag",
            description: "Elegant designer handbag for any occasion",
            price: 59.99,
            originalPrice: 79.99,
            image: waBag2,
            altText: "Luxury Handbag",
            category: "Accessories"
        },
        {
            productId: 308,
            name: "Fashion Sneakers",
            description: "Trendy sneakers for everyday style",
            price: 69.99,
            originalPrice: 89.99,
            image: waShoe1,
            altText: "Fashion Sneakers",
            category: "Footwear"
        },
        {
            productId: 309,
            name: "Modern African Dress",
            description: "Contemporary African dress design",
            price: 74.99,
            originalPrice: 94.99,
            image: woman4,
            altText: "Modern African Dress",
            category: "Women"
        },
        {
            productId: 310,
            name: "Evening African Gown",
            description: "Stunning evening gown with African prints",
            price: 119.99,
            originalPrice: 149.99,
            image: woman5,
            altText: "Evening African Gown",
            category: "Women"
        },
        {
            productId: 311,
            name: "Elegant African Dress",
            description: "Beautiful elegant dress with African patterns",
            price: 84.99,
            originalPrice: 109.99,
            image: waDress1,
            altText: "Elegant African Dress",
            category: "Women"
        },
        {
            productId: 312,
            name: "Casual African Wear",
            description: "Comfortable casual wear with African prints",
            price: 54.99,
            originalPrice: 74.99,
            image: waDress2,
            altText: "Casual African Wear",
            category: "Women"
        },
        {
            productId: 313,
            name: "Designer Handbag",
            description: "Stylish designer handbag",
            price: 49.99,
            originalPrice: 69.99,
            image: waBag1,
            altText: "Designer Handbag",
            category: "Accessories"
        },
        {
            productId: 314,
            name: "Leather Handbag",
            description: "Premium leather handbag",
            price: 64.99,
            originalPrice: 89.99,
            image: waBag3,
            altText: "Leather Handbag",
            category: "Accessories"
        },
        {
            productId: 315,
            name: "Fashion Handbag",
            description: "Modern fashion handbag",
            price: 44.99,
            originalPrice: 59.99,
            image: waBag4,
            altText: "Fashion Handbag",
            category: "Accessories"
        },
        {
            productId: 316,
            name: "Classic Braids Style 1",
            description: "Traditional African braid hairstyle",
            price: 29.99,
            originalPrice: 39.99,
            image: waBraid1,
            altText: "Classic Braids Style 1",
            category: "Accessories"
        },
        {
            productId: 317,
            name: "Classic Braids Style 2",
            description: "Traditional African braid hairstyle",
            price: 29.99,
            originalPrice: 39.99,
            image: waBraid2,
            altText: "Classic Braids Style 2",
            category: "Accessories"
        },
        {
            productId: 318,
            name: "Classic Braids Style 3",
            description: "Traditional African braid hairstyle",
            price: 29.99,
            originalPrice: 39.99,
            image: waBraid3,
            altText: "Classic Braids Style 3",
            category: "Accessories"
        },
        {
            productId: 319,
            name: "Classic Braids Style 4",
            description: "Traditional African braid hairstyle",
            price: 29.99,
            originalPrice: 39.99,
            image: waBraid4,
            altText: "Classic Braids Style 4",
            category: "Accessories"
        },
        {
            productId: 320,
            name: "Classic Braids Style 5",
            description: "Traditional African braid hairstyle",
            price: 29.99,
            originalPrice: 39.99,
            image: waBraid5,
            altText: "Classic Braids Style 5",
            category: "Accessories"
        },
        {
            productId: 321,
            name: "Classic Braids Style 6",
            description: "Traditional African braid hairstyle",
            price: 29.99,
            originalPrice: 39.99,
            image: waBraid6,
            altText: "Classic Braids Style 6",
            category: "Accessories"
        },
        {
            productId: 322,
            name: "Classic Braids Style 7",
            description: "Traditional African braid hairstyle",
            price: 29.99,
            originalPrice: 39.99,
            image: waBraid7,
            altText: "Classic Braids Style 7",
            category: "Accessories"
        },
        {
            productId: 323,
            name: "Classic Braids Style 8",
            description: "Traditional African braid hairstyle",
            price: 29.99,
            originalPrice: 39.99,
            image: waBraid8,
            altText: "Classic Braids Style 8",
            category: "Accessories"
        },
        {
            productId: 324,
            name: "Classic Braids Style 9",
            description: "Traditional African braid hairstyle",
            price: 29.99,
            originalPrice: 39.99,
            image: waBraid9,
            altText: "Classic Braids Style 9",
            category: "Accessories"
        },
        {
            productId: 325,
            name: "Fashion T-Shirt",
            description: "Comfortable cotton t-shirt",
            price: 24.99,
            originalPrice: 34.99,
            image: waTsht1,
            altText: "Fashion T-Shirt",
            category: "Men"
        },
        {
            productId: 326,
            name: "Casual T-Shirt",
            description: "Stylish casual t-shirt",
            price: 24.99,
            originalPrice: 34.99,
            image: waTsht2,
            altText: "Casual T-Shirt",
            category: "Men"
        },
        {
            productId: 327,
            name: "Stunning Evening Dress",
            description: "Beautiful evening dress",
            price: 94.99,
            originalPrice: 124.99,
            image: waDress6,
            altText: "Stunning Evening Dress",
            category: "Women"
        },
        {
            productId: 328,
            name: "Party Dress",
            description: "Perfect party dress",
            price: 79.99,
            originalPrice: 99.99,
            image: waDress8,
            altText: "Party Dress",
            category: "Women"
        },
        {
            productId: 329,
            name: "Summer Dress",
            description: "Light and breezy summer dress",
            price: 59.99,
            originalPrice: 79.99,
            image: waDress9,
            altText: "Summer Dress",
            category: "Women"
        },
        {
            productId: 330,
            name: "Floral Print Dress",
            description: "Beautiful floral print dress",
            price: 69.99,
            originalPrice: 89.99,
            image: waDress10,
            altText: "Floral Print Dress",
            category: "Women"
        },
        {
            productId: 331,
            name: "Classic Mini Dress",
            description: "Elegant mini dress",
            price: 54.99,
            originalPrice: 74.99,
            image: waDress11,
            altText: "Classic Mini Dress",
            category: "Women"
        },
        {
            productId: 332,
            name: "Premium Handbag",
            description: "Premium quality handbag",
            price: 59.99,
            originalPrice: 79.99,
            image: waBag6,
            altText: "Premium Handbag",
            category: "Accessories"
        },
        {
            productId: 333,
            name: "Luxury Bag",
            description: "Luxury designer bag",
            price: 74.99,
            originalPrice: 99.99,
            image: waBag7,
            altText: "Luxury Bag",
            category: "Accessories"
        },
        {
            productId: 334,
            name: "Designer Bag",
            description: "Exclusive designer bag",
            price: 54.99,
            originalPrice: 74.99,
            image: waBag8,
            altText: "Designer Bag",
            category: "Accessories"
        }
    ]

    const handleAddToCart = async (product) => {
        // Check if user is logged in
        if (!isAuthenticated) {
            showNotification("error", "Please login to add items to cart")
            navigate("/login")
            return
        }

        setAddingProductId(product.productId)

        // Add to cart using CartContext
        addToCart(product, "M", "Default")

        // Show success notification
        showNotification("success", `${product.name} added to cart!`)
        setAddingProductId(null)
    }

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto">
                <h2 className="mb-4 text-4xl font-bold text-center">Featured Collection</h2>
                <p className="mb-12 text-lg text-center text-gray-600">
                    Discover our handpicked selection of premium African fashion
                </p>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {featuredProducts.map((product) => (
                        <div key={product.productId} className="overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-lg hover:shadow-xl">
                            <div className="relative">
                                <img 
                                    src={product.image}
                                    alt={product.altText}
                                    className="object-cover w-full h-80"
                                />
                                <div className="absolute top-3 left-3">
                                    <span className="px-3 py-1 text-xs font-bold text-white bg-gray-900 rounded-full">
                                        {product.category}
                                    </span>
                                </div>
                                {product.originalPrice > product.price && (
                                    <div className="absolute px-3 py-1 text-xs font-bold text-white bg-red-600 rounded-full top-3 right-3">
                                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                                    </div>
                                )}
                            </div>
                            <div className="p-5">
                                <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                                <p className="mt-2 text-sm text-gray-600">{product.description}</p>
                                <div className="flex items-center gap-3 mt-3">
                                    <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                                    {product.originalPrice > product.price && (
                                        <span className="text-lg text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    disabled={addingProductId === product.productId}
                                    className={`w-full px-6 py-3 mt-4 text-lg font-semibold text-white rounded-lg transition-colors ${
                                        addingProductId === product.productId
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-gray-900 hover:bg-red-600'
                                    }`}
                                >
                                    {addingProductId === product.productId ? 'Adding to Cart...' : 'Add to Cart'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FeaturedCollection
