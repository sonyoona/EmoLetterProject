const VARIANTS = {
  pink: 'text-white bg-gradient-to-r from-pink-300 to-pink-400 hover:from-pink-400 hover:to-pink-500',
  purple:
    'text-white bg-gradient-to-r from-purple-300 to-purple-400 hover:from-purple-400 hover:to-purple-500',
  gradient:
    'text-white bg-gradient-to-r from-pink-300 to-purple-300 hover:from-pink-400 hover:to-purple-400',
  neutral: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  danger: 'text-white bg-gradient-to-r from-rose-400 to-red-400 hover:from-rose-500 hover:to-red-500',
  ghostDanger: 'bg-white border-2 border-rose-200 text-rose-500 hover:bg-rose-50',
};

const SIZES = {
  md: 'px-6 py-2.5',
  lg: 'px-6 py-3',
};

const Button = ({
  variant = 'pink',
  size = 'lg',
  type = 'button',
  disabled = false,
  className = '',
  children,
  ...props
}) => (
  <button
    type={type}
    disabled={disabled}
    className={`
      rounded-xl font-medium shadow-sm transition-all duration-200
      ${SIZES[size]}
      ${disabled ? 'bg-gray-300 text-white cursor-not-allowed' : `${VARIANTS[variant]} hover:shadow-md`}
      ${className}
    `}
    {...props}
  >
    {children}
  </button>
);

export default Button;
