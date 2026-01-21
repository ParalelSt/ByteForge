import SectionContainer from "@/components/common/SectionContainer";
import "@/styles/about/aboutContent.scss";
import ShopNowBtn from "@/components/common/ShopNowBtn";

const AboutContent = () => {
  const aboutPageText = [
    {
      title: "Who We Are",
      text: "We offer high-quality, performance-driven gaming gear, curated with care to meet the needs of our community.",
    },

    {
      title: "Our Story",
      text: "Founded in 2020, ByteForge began as a passion project for gaming hardware and has evolved into a trusted source for quality, performance-focused gear.",
    },
  ];

  return (
    <>
      <div className="about-content-container">
        <h1>ABOUT BYTEFORGE</h1>

        {aboutPageText.map((p) => (
          <SectionContainer className="about-content-section">
            <h2>{p.title}</h2>
            <p>{p.text}</p>
          </SectionContainer>
        ))}
        <SectionContainer className="about-content-section">
          <h2>Why Choose Us</h2>
          <ul>
            <li>
              <span>Fast Shipping</span>
            </li>
            <li>
              <span>Curated Products</span>
            </li>
            <li>
              <span>Trusted by Gamers</span>
            </li>
          </ul>
        </SectionContainer>
        <ShopNowBtn link="/shop" />
      </div>
    </>
  );
};

export default AboutContent;
