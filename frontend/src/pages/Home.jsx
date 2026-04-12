import Hero from "../components/Layout/Hero"; 
import GenderCollectionSection from "../components/Products/GenderCollectionSection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetails from "../components/Products/ProductDetails";
import ProductGrid from "../components/Products/ProductGrid";
import FeaturedCollection from "../components/Products/FeaturedCollection";
import KidsWear from "../components/Products/KidsWear";
import AfricanBeads from "../components/Products/AfricanBeads";

const Home = () => {
  return <div>
  <Hero />
  <GenderCollectionSection />
  <NewArrivals />
  <ProductDetails />
  <ProductGrid />
  <FeaturedCollection />
  <KidsWear />
  <AfricanBeads />
  </div>
}

export default Home
