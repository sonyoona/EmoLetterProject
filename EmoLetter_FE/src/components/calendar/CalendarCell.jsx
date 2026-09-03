const cellStyle = ({ isToday, isCurrentMonth }) => {
  if (isToday) {
    return 'bg-gradient-to-br from-pink-300 to-purple-300 text-white border-pink-400 shadow-lg scale-105';
  }
  if (isCurrentMonth) {
    return 'bg-pink-50/50 border-pink-200/50 text-gray-700 hover:bg-pink-100/70 hover:border-pink-300 hover:scale-105';
  }
  return 'bg-gray-50/30 border-gray-200/30 text-gray-400 opacity-50';
};

const CalendarCell = ({ dayInfo, emoji, onClick }) => (
  <button
    type="button"
    onClick={() => onClick(dayInfo.date)}
    className={`
      aspect-square rounded-xl border-2 transition-all duration-200 cursor-pointer
      flex flex-col items-center justify-center text-lg font-medium relative
      ${cellStyle(dayInfo)}
    `}
  >
    <span className={emoji ? 'text-2xl mb-1' : ''}>{dayInfo.day}</span>
    {emoji && <span className="text-3xl">{emoji}</span>}
  </button>
);

export default CalendarCell;
