import { EMOTIONS } from '../../constants/emotions';

const EmotionPicker = ({ value, onChange }) => (
  <div>
    <label className="block text-lg font-semibold text-gray-700 mb-4">감정 선택</label>
    <div className="grid grid-cols-4 gap-4">
      {EMOTIONS.map((emotion) => (
        <button
          key={emotion.code}
          type="button"
          onClick={() => onChange(emotion.code)}
          className={`
            p-4 rounded-xl border-2 transition-all duration-200
            ${
              value === emotion.code
                ? 'bg-gradient-to-br from-pink-300 to-purple-300 border-pink-400 scale-105 shadow-lg'
                : 'bg-white border-pink-200 hover:border-pink-300 hover:bg-pink-50'
            }
          `}
        >
          <div className="text-4xl mb-2">{emotion.emoji}</div>
          <div className="text-sm font-medium text-gray-700">{emotion.label}</div>
        </button>
      ))}
    </div>
  </div>
);

export default EmotionPicker;
