import "@/styles/common/shopNowBtn.scss";
import { Link } from "react-router-dom";

interface ShopNowBtnProps {
  link: string;
}

const ShopNowBtn = ({ link }: ShopNowBtnProps) => {
  return (
    <Link to={link} className="shop-now-btn">
      SHOP NOW
    </Link>
  );
};

export default ShopNowBtn;
