import "@/styles/promo.scss";
import ShopNowBtn from "@/components/ShopNowBtn";
import SectionContainer from "@/components/SectionContainer";
import { useEffect, useState } from "react";

type PromoType = {
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
};

const Promo = () => {
  const [promo, setPromo] = useState<PromoType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPromo = () => {
      fetch("http://192.168.1.105:3000/promos/promo")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch promo");
          return res.json();
        })
        .then((data) => {
          if (isMounted) {
            setPromo(data);
            setLoading(false);
            setError(null);
          }
        })
        .catch(() => {
          if (isMounted) {
            setPromo(null);
            setError("No promo available or failed to fetch.");
            setLoading(false);
          }
        });
    };
    fetchPromo();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="promo-card">
        <SectionContainer className="promo-card-bottom">
          <h2 className="promo-title">Loading promo...</h2>
        </SectionContainer>
      </div>
    );
  }

  if (error || !promo) {
    return (
      <div className="promo-card">
        <SectionContainer className="promo-card-bottom">
          <h2 className="promo-title">No promo available</h2>
          <p className="promo-text">
            {error || "Check back later for new promotions."}
          </p>
        </SectionContainer>
      </div>
    );
  }

  let imageSrc = promo.imageUrl;
  if (imageSrc && !imageSrc.startsWith("http")) {
    imageSrc = `http://192.168.1.105:3000/images/promo_images/${imageSrc.replace(
      /^.*[\\/]/,
      ""
    )}`;
  }

  return (
    <div className="promo-card">
      <div className="promo-card-top">
        <img src={imageSrc} alt={promo.title} className="promo-image" />
      </div>
      <SectionContainer className="promo-card-bottom">
        <h2 className="promo-title">{promo.title}</h2>
        <p className="promo-text">{promo.description}</p>
        {promo.link && <ShopNowBtn link={promo.link} />}
      </SectionContainer>
    </div>
  );
};

export default Promo;
