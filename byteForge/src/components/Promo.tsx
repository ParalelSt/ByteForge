import "@/styles/promo.scss";
import ShopNowBtn from "@/components/ShopNowBtn";
import SectionContainer from "./SectionContainer";

const Promo = () => {
  return (
    <div className="promo-container">
      <div className="promo-container-top">
        <div className="promo-container-top-left">
          <img src="" alt="promo-image" className="promo-image" />
        </div>
        <SectionContainer className="promo-container-top-right">
          <h2 className="promo-title">PROMO SECTION</h2>
          <p className="promo-text">
            Lorem ipsum adispiscing amet ofenim erodit. Lorem ipsum adispiscing
            amet ofenim
          </p>
        </SectionContainer>
      </div>
      <div className="promo-container-bottom">
        <ShopNowBtn link="/shop/promo" />
      </div>
    </div>
  );
};

export default Promo;
