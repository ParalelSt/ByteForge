import SectionContainer from "@/components/SectionContainer";
import "@/styles/aboutContent.scss";

const AboutContent = () => {
  const aboutPageText = [
    {
      title: "Who We Are",
      text: "We provide high-quality gaming gear for gamers, creators, and tech enthusiasts. Our products are performance-driven and carefully curated to meet the needs of our community.",
    },

    {
      title: "Our Story",
      text: "Founded in 2020, ByteForge was born out of a passion for gaming hardware. We set out to create a trusted source for cutting-edge gear. From our humble beginnings, we’ve grown into a thriving hub for gamers seeking quality and reliability.",
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
      </div>
    </>
  );
};

export default AboutContent;
