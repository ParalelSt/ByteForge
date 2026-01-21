import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

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
