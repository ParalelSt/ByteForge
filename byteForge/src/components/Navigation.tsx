import "@/styles/navigation.scss";

interface NavigationProps {
  isOpen?: boolean;
}

const Navigation = ({ isOpen }: NavigationProps) => {
  return (
    <>
      <nav className={`nav-links ${isOpen ? "open" : ""}`}>
        <a href="/shop">
          <span>Shop</span>
        </a>
        <a href="/about">
          <span>About</span>
        </a>
        <a href="/contact">
          <span>Contact</span>
        </a>
      </nav>
    </>
  );
};

export default Navigation;
