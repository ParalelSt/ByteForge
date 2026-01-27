import "@/styles/home/hero.scss";
import { useState } from "react";
import ShopNowBtn from "@/components/common/ShopNowBtn";
import SectionContainer from "@/components/common/SectionContainer";

const Hero = () => {
  const heroUrl =
    import.meta.env.VITE_HERO_BG_URL ||
    `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/site_assets/byteforge_hero_bg.svg`;

  const [src, setSrc] = useState(heroUrl);

  return (
    <SectionContainer className="hero-section">
      <img
        className="hero-bg"
        src={src}
        alt="Hero"
        onError={() => setSrc("/byteforge_hero_bg.svg")}
      />
      <h1>GEAR UP. GAME ON.</h1>
      <p>Performance-driven gaming gear for champions.</p>
      <ShopNowBtn link="/shop" />
      <div className="hero-content"></div>
    </SectionContainer>
  );
};

export default Hero;
