import { useState, useEffect, useMemo } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
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

// All products data (same as ShopPage)
const allProducts = [
  // Men
  { id: 1, name: "Classic White Shirt", price: 29.99, originalPrice: 39.99, gender: "men", category: "topwear", sizes: ["S", "M", "L", "XL"], image: man5 },
  { id: 2, name: "Blue Denim Jeans", price: 49.99, originalPrice: 69.99, gender: "men", category: "bottoms", sizes: ["28", "30", "32", "34"], image: man6 },
  { id: 3, name: "Black Leather Jacket", price: 89.99, originalPrice: 119.99, gender: "men", category: "topwear", sizes: ["S", "M", "L", "XL"], image: man7 },
  { id: 4, name: "Executive Style", price: 74.99, originalPrice: 94.99, gender: "men", category: "topwear", sizes: ["S", "M", "L", "XL"], image: men2 },
  { id: 5, name: "Modern Menswear", price: 54.99, originalPrice: 74.99, gender: "men", category: "topwear", sizes: ["S", "M", "L", "XL"], image: man1 },
  { id: 6, name: "Casual Denim", price: 44.99, originalPrice: 59.99, gender: "men", category: "bottoms", sizes: ["28", "30", "32", "34"], image: man3 },
  
  // Women
  { id: 7, name: "Summer Dress", price: 39.99, originalPrice: 54.99, gender: "women", category: "dresses", sizes: ["XS", "S", "M", "L", "XL"], image: dress1 },
  { id: 8, name: "African Print Ankara", price: 79.99, originalPrice: 99.99, gender: "women", category: "dresses", sizes: ["XS", "S", "M", "L", "XL"], image: afrwear1 },
  { id: 9, name: "Traditional Wear", price: 89.99, originalPrice: 119.99, gender: "women", category: "dresses", sizes: ["XS", "S", "M", "L", "XL"], image: afrwear2 },
  { id: 10, name: "Wrap Dress", price: 45.99, originalPrice: 59.99, gender: "women", category: "dresses", sizes: ["XS", "S", "M", "L", "XL"], image: afrwear4 },
  { id: 11, name: "Casual Wear", price: 34.99, originalPrice: 44.99, gender: "women", category: "topwear", sizes: ["XS", "S", "M", "L", "XL"], image: wear1 },
  { id: 12, name: "Formal Attire", price: 59.99, originalPrice: 79.99, gender: "women", category: "topwear", sizes: ["XS", "S", "M", "L", "XL"], image: wear2 },
  { id: 13, name: "Street Style", price: 44.99, originalPrice: 59.99, gender: "women", category: "topwear", sizes: ["XS", "S", "M", "L", "XL"], image: wear3 },
  { id: 14, name: "Accessories", price: 19.99, originalPrice: 29.99, gender: "women", category: "accessories", sizes: ["One Size"], image: wear4 },
  
  // Kids
  { id: 15, name: "Kids African Print", price: 24.99, originalPrice: 34.99, gender: "kids", category: "topwear", sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], image: man5 },
  { id: 16, name: "Kids Denim Jeans", price: 19.99, originalPrice: 29.99, gender: "kids", category: "bottoms", sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], image: man6 },
  { id: 17, name: "Kids Party Dress", price: 29.99, originalPrice: 39.99, gender: "kids", category: "dresses", sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], image: dress1 },
  { id: 18, name: "Kids Ankara Set", price: 34.99, originalPrice: 44.99, gender: "kids", category: "topwear", sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], image: afrwear1 },
]

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get("q") || ""
  
  const [searchQuery, setSearchQuery] = useState(query)

  // Filter products based on search query
  const searchResults = useMemo(() => {
    if (!query.trim()) return []
    
    const lowerQuery = query.toLowerCase()
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery) ||
      product.gender.toLowerCase().includes(lowerQuery)
    )
  }, [query])

  // Log search results to console
  useEffect(() => {
    if (query.trim()) {
      console.log("=== SEARCH RESULTS ===")
      console.log("Search Query:", query)
      console.log("Number of results found:", searchResults.length)
      console.log("Search Results:", searchResults)
      console.log("===================")
    }
  }, [query, searchResults])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery })
    }
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">Search Results</h1>
      
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#ea2e0e]"
          />
          <button 
            type="submit"
            className="px-6 py-2 bg-[#ea2e0e] text-white rounded-lg hover:bg-red-600"
          >
            Search
          </button>
        </form>
      </div>

      {query ? (
        <div>
          <p className="mb-4 text-gray-600">Showing results for "{query}" ({searchResults.length} products found)</p>
          
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
              {searchResults.map((product) => (
                <div key={product.id} className="overflow-hidden transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="object-cover w-full h-48"
                  />
                  <div className="p-4">
                    <h3 className="mb-2 text-lg font-semibold">{product.name}</h3>
                    <p className="mb-2 text-sm text-gray-600 capitalize">{product.gender} - {product.category}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[#ea2e0e] font-bold">${product.price.toFixed(2)}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-gray-500">Sizes: {product.sizes.join(", ")}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No products found matching "{query}".</p>
          )}
        </div>
      ) : (
        <p className="text-gray-500">Enter a search term to find products.</p>
      )}
    </div>
  )
}

export default SearchPage
