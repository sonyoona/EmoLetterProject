const Card = ({ className = '', children, ...props }) => (
  <div
    className={`bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-pink-100/50 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;
