import { Link } from "react-router-dom"
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="pt-12 pb-6 text-white bg-gray-900">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2 lg:grid-cols-4">
        

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Shop</h3>
            <ul className="space-y-2" >
              <li><Link to="/men" className="text-gray-400 hover:text-[#ea2e0e]">Men's Wear</Link></li>
              <li><Link to="/women" className="text-gray-400 hover:text-[#ea2e0e]">Women's wear</Link></li>
              <li><Link to="/topwear" className="text-gray-400 hover:text-[#ea2e0e]">Tops Wear</Link></li>
              <li><Link to="/bottoms" className="text-gray-400 hover:text-[#ea2e0e]">Bottom Wear</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/chat" className="text-gray-400 hover:text-white">Contact Us</Link></li>
              <li><Link to="/track-order" className="text-gray-400 hover:text-white">Track Order</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white">FAQs</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white">Features</Link></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="mb-4 text-xl font-bold"> Follow Aromomit-Fashions</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FaYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Visit Our Store</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center gap-2">
                <FaPhone className="w-4 h-4" />
                <span>+1 234 567 890</span>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="w-4 h-4" />
                <span>info@aromomit.com</span>
              </li>
              <li className="flex items-center gap-2">
                <FaMapMarkerAlt className="w-4 h-4" />
                <span>Memphis International Flea Market, TN</span>
              </li>
            </ul>
            {/* Google Maps Embed */}
            <div className="mt-4 overflow-hidden rounded-lg">
              <iframe
                title="Memphis International Flea Market Location"
                width="100%"
                height="150"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3261.4251875000003!2d-89.87404468482413!3d35.05887498028776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x887f8374575c3b69%3A0x501e5b5c5e9d9f0!2sAgricenter%20International!5e0!3m2!1sen!2sus!4v1645568400000!5m2!1sen!2sus">
              </iframe>
            </div>
          </div>
        </div>

         

        {/* Payment Methods */}
        <div className="pt-6 border-t border-gray-800">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p className="text-sm text-gray-400">
              © 2026 Aromomit-Fashions. All rights reserved.
            </p>
            <div className="flex mt-4 space-x-4 md:mt-0">
              
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
