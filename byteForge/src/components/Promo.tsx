import "@/styles/promo.scss";
import ShopNowBtn from "@/components/ShopNowBtn";
import SectionContainer from "./SectionContainer";

const Promo = () => {
  return (
    <div className="promo-container">
      <div className="promo-container-top">
        <img
          src="./src/assets/Logitech_G502.avif"
          alt="promo-image"
          className="promo-image"
        />
      </div>
      <SectionContainer className="promo-container-bottom">
        <h2 className="promo-title">PROMO SECTION</h2>
        <p className="promo-text">
          Lorem ipsum adispiscing amet ofenim erodit. Lorem ipsum adispiscing
          amet ofenim text-align: center; text-align: center; text-align:
          center; text-align: center; text-align: center; text-align: center;
          text-align: center; text-align: center; text-align: center;
          text-align: center;
        </p>
        <ShopNowBtn link="/shop/promo" />
      </SectionContainer>
    </div>
  );
};

export default Promo;
