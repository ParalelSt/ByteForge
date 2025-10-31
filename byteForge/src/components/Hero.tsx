import "@/styles/hero.scss";
import "@/hooks/useShopRedirect";

import SectionContainer from "./SectionContainer";
import useShopRedirect from "@/hooks/useShopRedirect";

const Hero = () => {
  const handleShopRedirect = useShopRedirect();

  return (
    <>
      <SectionContainer className="hero-section">
        <h1>GEAR UP. GAME ON.</h1>
        <p>Performance-driven gaming gear for champions.</p>
        <button onClick={handleShopRedirect}>SHOP NOW</button>
      </SectionContainer>
    </>
  );
};

export default Hero;
