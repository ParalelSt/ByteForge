import "@/styles/common/sectionContainer.scss";

type SectionContainerProps = {
  children: React.ReactNode;
  className?: string;
};

const SectionContainer = ({ children, className }: SectionContainerProps) => {
  return (
    <section className={`section-container ${className}`}>{children}</section>
  );
};

export default SectionContainer;
