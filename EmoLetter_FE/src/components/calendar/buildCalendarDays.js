import { toDateKey } from '../../utils/date';

const TOTAL_CELLS = 42;

/** 달력 한 화면(6주 × 7일)에 들어갈 날짜 목록을 만든다. */
export const buildCalendarDays = (year, month) => {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const todayKey = toDateKey(new Date());

  const days = [];

  for (let i = firstWeekday - 1; i >= 0; i -= 1) {
    const day = daysInPrevMonth - i;
    days.push({ day, date: new Date(year, month - 1, day), isCurrentMonth: false });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    days.push({ day, date, isCurrentMonth: true, isToday: toDateKey(date) === todayKey });
  }

  for (let day = 1; days.length < TOTAL_CELLS; day += 1) {
    days.push({ day, date: new Date(year, month + 1, day), isCurrentMonth: false });
  }

  return days;
};

export default buildCalendarDays;
