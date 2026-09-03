import { NOTES } from '../../constants/notes';

const NotePicker = ({ value, onChange }) => (
  <div>
    <label className="block text-lg font-semibold text-gray-700 mb-3">편지지</label>
    <div className="grid grid-cols-4 gap-3">
      {NOTES.map((note) => (
        <button
          key={note.code}
          type="button"
          onClick={() => onChange(note.code)}
          className={`rounded-xl border-2 p-3 transition-all duration-200 ${
            value === note.code ? `${note.accent} scale-105 shadow-md` : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <span className={`block h-10 rounded-lg bg-gradient-to-br ${note.preview}`} />
          <span className="block mt-2 text-sm font-medium text-gray-700">{note.label}</span>
        </button>
      ))}
    </div>
  </div>
);

export default NotePicker;
