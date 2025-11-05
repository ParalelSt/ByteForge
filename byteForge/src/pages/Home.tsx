import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Promo from "@/components/Promo";

const Home = () => {
  return (
    <>
      <div className="container">
        <Header />
        <Hero />
        <FeaturedProducts />
        <Promo />
        <Footer />
      </div>
    </>
  );
};

export default Home;
