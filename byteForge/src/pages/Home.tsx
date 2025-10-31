import FeaturedProducts from "@/components/FeaturedProducts";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

const Home = () => {
  return (
    <>
      <div className="container">
        <Header />
        <Hero />
        <FeaturedProducts />
      </div>
    </>
  );
};

export default Home;
