import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="page">
      <Header />

      <div className="container">{children}</div>

      <Footer />
    </div>
  );
};

export default Layout;
