const TONES = {
  pink: {
    active: 'bg-gradient-to-r from-pink-300 to-purple-300 text-white shadow-md',
    idle: 'bg-white border-2 border-pink-200 text-pink-600 hover:bg-pink-50',
  },
  purple: {
    active: 'bg-gradient-to-r from-purple-300 to-purple-400 text-white shadow-md',
    idle: 'bg-white border-2 border-purple-200 text-purple-600 hover:bg-purple-50',
  },
};

/** options: [{ value, label, count }] */
const FilterTabs = ({ options, value, onChange, tone = 'pink' }) => (
  <div className="mb-8 flex justify-center gap-3 flex-wrap">
    {options.map((option) => (
      <button
        key={option.value}
        onClick={() => onChange(option.value)}
        className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
          value === option.value ? TONES[tone].active : TONES[tone].idle
        }`}
      >
        {option.label}
        {option.count !== undefined && ` (${option.count})`}
      </button>
    ))}
  </div>
);

export default FilterTabs;
