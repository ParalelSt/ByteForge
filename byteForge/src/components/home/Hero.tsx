import "@/styles/home/hero.scss";
import ShopNowBtn from "@/components/common/ShopNowBtn";
import SectionContainer from "@/components/common/SectionContainer";

const Hero = () => {
  return (
    <SectionContainer className="hero-section">
      <img
        className="hero-bg"
        src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/site_assets/byteforge_hero_bg.svg`}
        alt="Hero"
      />
      <h1>GEAR UP. GAME ON.</h1>
      <p>Performance-driven gaming gear for champions.</p>
      <ShopNowBtn link="/shop" />
      <div className="hero-content"></div>
    </SectionContainer>
  );
};

export default Hero;
