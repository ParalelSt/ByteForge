import "@/styles/home/hero.scss";
import ShopNowBtn from "@/components/common/ShopNowBtn";
import SectionContainer from "@/components/common/SectionContainer";

const Hero = () => {
  return (
    <SectionContainer className="hero-section">
      <h1>GEAR UP. GAME ON.</h1>
      <p>Performance-driven gaming gear for champions.</p>
      <ShopNowBtn link="/shop" />
    </SectionContainer>
  );
};

export default Hero;
