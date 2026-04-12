import Header from "../Common/Header";
import Footer from "../Layout/Footer";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
//   // Sample products for the main content
//   const products = [
//     { id: 1, name: "African Print Shirt", price: 49.99, category: "Men", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop" },
//     { id: 2, name: "Ankara Dress", price: 79.99, category: "Women", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop" },
//     { id: 3, name: "Kente Cloth Blazer", price: 39.99, category: "Men", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=500&fit=crop" },
//     { id: 4, name: "African Queen Gown", price: 99.99, category: "Women", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=500&fit=crop" },
//     { id: 5, name: "Dashiki Top", price: 24.99, category: "Men", image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=400&h=500&fit=crop" },
//     { id: 6, name: "Kitenge Skirt", price: 59.99, category: "Women", image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=500&fit=crop" },
//     { id: 7, name: "Traditional Agbada", price: 69.99, category: "Men", image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=500&fit=crop" },
//     { id: 8, name: "Nigerian Gele Headtie", price: 89.99, category: "Accessories", image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400&h=500&fit=crop" },
//   ]

//   const categories = [
//     { name: "Men", image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=400&h=300&fit=crop" },
//     { name: "Women", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=300&fit=crop" },
//     { name: "Kids", image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400&h=300&fit=crop" },
//     { name: "Accessories", image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400&h=300&fit=crop" },
//   ]

  return (
    // <div className="flex flex-col min-h-screen">
    <>
      <Header />
      
      {/* Main Content */}
      <main className="flex-grow">
        <Outlet /> 
      </main>

      <Footer />
      </>
    
  )
}

export default UserLayout
