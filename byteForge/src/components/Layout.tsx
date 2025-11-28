import Footer from "@/components/Footer";
import Header from "@/components/Header";

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
