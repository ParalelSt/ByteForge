import "@/styles/shopNowBtn.scss";
import { Link } from "react-router-dom";

interface ShopNowBtnProps {
  link: string;
}

const ShowNowBtn = ({ link }: ShopNowBtnProps) => {
  return (
    <Link to={link} className="shop-now-btn">
      SHOP NOW
    </Link>
  );
};

export default ShowNowBtn;
