const GradientHeading = ({ as = 'h2', className = '', children }) => {
  const Tag = as;
  return (
    <Tag
      className={`font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent ${className}`}
    >
      {children}
    </Tag>
  );
};

export default GradientHeading;
