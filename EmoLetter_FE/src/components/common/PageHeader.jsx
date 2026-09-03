import GradientHeading from './GradientHeading';

const PageHeader = ({ title, subtitle, className = '' }) => (
  <header className={`text-center ${className}`}>
    <GradientHeading className="text-4xl">{title}</GradientHeading>
    {subtitle && <p className="text-pink-400/70 text-sm mt-3">{subtitle}</p>}
  </header>
);

export default PageHeader;
