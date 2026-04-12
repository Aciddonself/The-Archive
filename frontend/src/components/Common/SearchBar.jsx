import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaSearch } from "react-icons/fa"

const SearchBar = ({ color = "white" }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const navigate = useNavigate()

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  return (
    <div className="relative">
      {/* Search Icon - always visible, click to toggle search form */}
      <button 
        onClick={handleSearchToggle}
        className={`hover:text-gray-300`}
        style={{ color: color }}
      >
        <FaSearch className="w-5 h-5" />
      </button>

      {/* Search Form - shows when isSearchOpen is true */}
      {isSearchOpen && (
        <form onSubmit={handleSearch} className="absolute right-0 p-2 mt-2 bg-gray-800 rounded-lg shadow-lg top-full">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 py-2 pl-3 pr-10 text-sm text-white bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-red-500 md:w-64"
            autoFocus
          />
          <button 
            type="submit"
            className="absolute text-gray-300 transform -translate-y-1/2 right-3 top-1/2 hover:text-red-500"
          >
            <FaSearch className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  )
}

export default SearchBar
