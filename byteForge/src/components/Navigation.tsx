import "@/styles/navigation.scss";

interface NavigationProps {
  isOpen?: boolean;
}

const Navigation = ({ isOpen }: NavigationProps) => {
  return (
    <>
      <nav className={`nav-links ${isOpen ? "open" : ""}`}>
        <a href="/shop">Shop</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </nav>
    </>
  );
};

export default Navigation;
