import { TbBrandMeta } from "react-icons/tb"; 
import { IoLogoInstagram } from "react-icons/io"; 
import { RiTwitterXLine } from "react-icons/ri"; 



const Topbar = () => {
  return (
    <div className="border-b border-gray-400 bg-[#ea2e0e] text-white py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Left - Social Icons */}
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-gray-300">
                <TbBrandMeta  className="h-5 w-5"/>
            </a>
            <a href="#" className="hover:text-gray-300">
                <IoLogoInstagram  className="h-5 w-5"/>
            </a>
            <a href="#" className="hover:text-gray-300">
                <RiTwitterXLine  className="h-4 w-4"/>
            </a>
          </div>

          {/* Center - Welcome Message */}
          <div className="text-sm">
            Welcome To Aromomit Fashions. Your one-stop online shop!
          </div>

          {/* Right - Phone Number */}
          <div className="text-sm">
            +1 234 567 890
          </div>
        </div>
      </div>
    </div>
  )
}

export default Topbar
