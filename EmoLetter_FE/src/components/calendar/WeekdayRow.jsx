const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const weekdayColor = (index) => {
  if (index === 0) return 'text-red-400';
  if (index === 6) return 'text-blue-400';
  return 'text-purple-400';
};

const WeekdayRow = () => (
  <div className="grid grid-cols-7 gap-3 mb-4">
    {WEEKDAYS.map((weekday, index) => (
      <div key={weekday} className={`text-center font-bold py-3 rounded-lg ${weekdayColor(index)}`}>
        {weekday}
      </div>
    ))}
  </div>
);

export default WeekdayRow;
