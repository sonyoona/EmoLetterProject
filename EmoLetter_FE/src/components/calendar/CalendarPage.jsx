import { useMemo, useState } from 'react';
import Card from '../common/Card';
import { ErrorMessage } from '../common/StatusMessage';
import CalendarGrid from './CalendarGrid';
import CalendarNav from './CalendarNav';
import buildCalendarDays from './buildCalendarDays';
import { useDiary } from '../../contexts/DiaryContext';

const CalendarPage = ({ onDateClick }) => {
  const { diaries, error, refresh } = useDiary();
  const [viewDate, setViewDate] = useState(() => new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const days = useMemo(() => buildCalendarDays(year, month), [year, month]);

  return (
    <div className="w-full flex flex-col items-center">
      <CalendarNav
        year={year}
        month={month}
        onPrev={() => setViewDate(new Date(year, month - 1, 1))}
        onNext={() => setViewDate(new Date(year, month + 1, 1))}
      />

      {error && (
        <div className="w-full max-w-5xl mb-4">
          <ErrorMessage onRetry={refresh}>{error}</ErrorMessage>
        </div>
      )}

      <Card className="p-8 w-full max-w-5xl">
        <CalendarGrid days={days} diaries={diaries} onDateClick={onDateClick} />
      </Card>
    </div>
  );
};

export default CalendarPage;
