import "@/styles/home/promo.scss";
import ShopNowBtn from "@/components/common/ShopNowBtn";
import SectionContainer from "@/components/common/SectionContainer";
import { useEffect, useState } from "react";

type PromoType = {
  title: string;
  description: string;
  image?: string;
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
      const apiUrl = import.meta.env.VITE_API_URL;
      fetch(`${apiUrl}/promos/promo`)
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
  if (!imageSrc || !imageSrc.startsWith("http")) {
    if (promo.image) {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      imageSrc = `${supabaseUrl}/storage/v1/object/public/promo_images/${promo.image.replace(
        /^.*[\\/]/,
        "",
      )}?t=${Date.now()}`;
    } else {
      imageSrc = "/placeholder.png";
    }
  }

  return (
    <div className="promo-card">
      <div className="promo-card-top">
        <img
          src={imageSrc}
          alt={promo.title}
          className="promo-image"
          loading="lazy"
        />
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
