import "@/styles/hero.scss";

import SectionContainer from "./SectionContainer";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <>
      <SectionContainer className="hero-section">
        <h1>GEAR UP. GAME ON.</h1>
        <p>Performance-driven gaming gear for champions.</p>
        <Link to={"/shop"}>SHOP NOW</Link>
      </SectionContainer>
    </>
  );
};

export default Hero;
