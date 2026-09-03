import CalendarCell from './CalendarCell';
import WeekdayRow from './WeekdayRow';
import { toDateKey } from '../../utils/date';
import { getEmotionEmoji } from '../../constants/emotions';

const CalendarGrid = ({ days, diaries, onDateClick }) => (
  <>
    <WeekdayRow />
    <div className="grid grid-cols-7 gap-3">
      {days.map((dayInfo) => {
        const diary = diaries[toDateKey(dayInfo.date)];
        return (
          <CalendarCell
            key={dayInfo.date.toISOString()}
            dayInfo={dayInfo}
            emoji={getEmotionEmoji(diary?.emotion)}
            onClick={onDateClick}
          />
        );
      })}
    </div>
  </>
);

export default CalendarGrid;
