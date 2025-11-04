import FeaturedProducts from "@/components/FeaturedProducts";
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
      </div>
    </>
  );
};

export default Home;
