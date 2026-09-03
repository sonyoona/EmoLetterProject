const TONES = {
  pink: 'border-pink-100 from-pink-50 text-pink-500',
  purple: 'border-purple-100 from-purple-50 text-purple-500',
  amber: 'border-amber-100 from-amber-50 text-amber-500',
};

const StatCard = ({ label, value, tone = 'pink' }) => {
  const [border, gradient, text] = TONES[tone].split(' ');
  return (
    <div className={`p-5 rounded-2xl border ${border} bg-gradient-to-br ${gradient} to-white shadow-sm`}>
      <p className={`text-sm mb-2 ${text}`}>{label}</p>
      <p className={`text-3xl font-bold ${text}`}>{value}</p>
    </div>
  );
};

export default StatCard;
