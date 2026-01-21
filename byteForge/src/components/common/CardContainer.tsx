import "@/styles/common/cardContainer.scss";

interface CardContainerProps {
  children: React.ReactNode;
  className?: string;
}

const CardContainer = ({ children, className }: CardContainerProps) => {
  return <div className={`card-container ${className}`}>{children}</div>;
};

export default CardContainer;
