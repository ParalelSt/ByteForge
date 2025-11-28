import "@/styles/promo.scss";
import ShopNowBtn from "@/components/ShopNowBtn";
import SectionContainer from "@/components/SectionContainer";

const Promo = () => {
  return (
    <div className="promo-container">
      <div className="promo-container-top">
        <img
          src="./src/assets/Logitech_G502.png"
          alt="promo-image"
          className="promo-image"
        />
      </div>
      <SectionContainer className="promo-container-bottom">
        <h2 className="promo-title">PROMO SECTION</h2>
        <p className="promo-text">
          Promo gear, apparel etcPromo gear, apparel etc Promo gear, apparel etc
          Promo gear, apparel etc
        </p>
        <ShopNowBtn link="/shop/promo" />
      </SectionContainer>
    </div>
  );
};

export default Promo;
