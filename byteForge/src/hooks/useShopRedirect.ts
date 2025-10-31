import { useNavigate } from "react-router-dom";

export default function useShopRedirect() {
  const NAVIGATE = useNavigate();

  return () => NAVIGATE("/shop");
}
