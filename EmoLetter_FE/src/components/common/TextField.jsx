const TONES = {
  pink: 'border-pink-200 focus:border-pink-400 focus:ring-pink-300',
  purple: 'border-purple-200 focus:border-purple-400 focus:ring-purple-300',
};

const TextField = ({
  label,
  error,
  tone = 'pink',
  as = 'input',
  className = '',
  ...props
}) => {
  const Tag = as;
  return (
    <div>
      {label && <label className="block mb-2 text-gray-700 font-semibold">{label}</label>}
      <Tag
        className={`
          w-full border-2 rounded-xl px-4 py-3 bg-white transition-all
          focus:outline-none focus:ring-2
          ${error ? 'border-red-300 focus:ring-red-400 bg-red-50/50' : TONES[tone]}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1.5">{error}</p>}
    </div>
  );
};

export default TextField;
