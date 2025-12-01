import "@/styles/footer.scss";
import { Link } from "react-router-dom";
import { IoLogoInstagram } from "react-icons/io";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-section footer-section-left">
        <div className="footer-section-center-div">
          <h2>CONTACT US</h2>
          <p className="address">
            1234 Byte Blvd, Tech City TC <span>667</span>
          </p>
        </div>
      </div>

      <div className="footer-section footer-section-middle">
        <div className="footer-section-center-div">
          <h2>QUICK LINKS</h2>
          <ul>
            <li>
              <Link to={"/shop"}>Shop</Link>
            </li>
            <li>
              <Link to={"/about"}>About</Link>
            </li>
            <li>
              <Link to={"/contact"}>Contact</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-section footer-section-right">
        <div className="footer-section-center-div">
          <h2>SOCIALS</h2>
          <div className="socials-links">
            <div className="icon-container">
              <Link to={"https://www.instagram.com/byte_forge_gaming_shop/"}>
                <IoLogoInstagram className="icon" />
              </Link>
            </div>
            <div className="icon-container">
              <Link to={"https://x.com/ByteForgeWeb"} className="icon">
                <FaXTwitter />
              </Link>
            </div>
            <div className="icon-container">
              <Link
                to={"https://www.linkedin.com/in/byte-forge-46568139b/"}
                className="icon"
              >
                <FaLinkedinIn />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
