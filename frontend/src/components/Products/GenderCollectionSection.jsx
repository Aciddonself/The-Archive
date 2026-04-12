import man1 from "../../assets/man1.webp"
import dress1 from "../../assets/dress1.jpg"
import { Link } from "react-router-dom"

const GenderCollectionSection = () => {
  return (
    <section className="px-4 py-16 lg:px-0">
        <div className="container flex flex-col gap-8 mx-auto md:flex-row ">

            {/* Women's Collection */}
            <div className="relative flex-1">
                <img src={dress1} alt="women's collection" 
                className="w-full h-[700px] object-cover"/>
            
            <div className="absolute p-4 bg-white bottom-8 left-8 bg-opacity-90">
                <h2 className="mb-3 text-2xl font-bold text-gray-900">
                    Women's Collection
                </h2>
                <Link to="/shop?gender=women" className="inline-block px-4 py-2 mt-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700">
                  Shop Now
                </Link>
            </div>
            </div>

            {/* Men's Collection */}

            <div className="relative flex-1">
                <img src={man1} alt="men's collection" 
                className="w-full h-[700px] object-cover"/>
            
            <div className="absolute p-4 bg-white bottom-8 left-8 bg-opacity-90">
                <h2 className="mb-3 text-2xl font-bold text-gray-900">
                    Men's Collection
                </h2>
                <Link to="/shop?gender=men" className="inline-block px-4 py-2 mt-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700">
                  Shop Now
                </Link>
            </div>
            </div>

        </div>
    </section>
  );
};

export default GenderCollectionSection;
