import { useState } from 'react';
import { useDiary } from '../contexts/DiaryContext';

const Calendar = ({ onDateClick }) => {
  const { getDiary } = useDiary();
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const currentDay = today.getDate();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
  
  // 달력 날짜 배열 생성
  const calendarDays = [];
  
  // 이전 달의 마지막 날짜들
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const date = new Date(year, month - 1, day);
    calendarDays.push({ day, date, isCurrentMonth: false });
  }
  
  // 현재 달의 날짜들
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    calendarDays.push({ 
      day: i, 
      date, 
      isCurrentMonth: true, 
      isToday: isCurrentMonth && i === currentDay 
    });
  }
  
  // 다음 달의 날짜들 (총 42개 셀을 채우기 위해)
  const remainingCells = 42 - calendarDays.length;
  for (let i = 1; i <= remainingCells; i++) {
    const date = new Date(year, month + 1, i);
    calendarDays.push({ day: i, date, isCurrentMonth: false });
  }

  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (date) => {
    if (onDateClick) {
      onDateClick(date);
    }
  };

  const emotionEmojis = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    anxious: '😰',
    excited: '🤩',
    calm: '😌',
    love: '🥰',
    tired: '😴',
  };

  const formatDateKey = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={goToPrevMonth}
            className="w-10 h-10 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-600 flex items-center justify-center transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            {year}년 {monthNames[month]}
          </h2>
          <button
            onClick={goToNextMonth}
            className="w-10 h-10 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-600 flex items-center justify-center transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <p className="text-pink-400/70 text-sm">감정을 기록하고 편지를 작성해보세요</p>
      </div>
      
      <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-pink-100/50 w-full max-w-5xl">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-3 mb-4">
          {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
            <div 
              key={day} 
              className={`text-center font-bold py-3 rounded-lg ${
                index === 0 ? 'text-red-400' : index === 6 ? 'text-blue-400' : 'text-purple-400'
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* 달력 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-3">
          {calendarDays.map((dateObj, index) => {
            const diary = getDiary(dateObj.date);
            const emotionEmoji = diary ? emotionEmojis[diary.emotion] || '📝' : null;
            
            return (
              <div
                key={index}
                onClick={() => handleDateClick(dateObj.date)}
                className={`
                  aspect-square rounded-xl border-2 transition-all duration-200 cursor-pointer 
                  flex flex-col items-center justify-center text-lg font-medium relative
                  ${
                    dateObj.isToday
                      ? 'bg-gradient-to-br from-pink-300 to-purple-300 text-white border-pink-400 shadow-lg scale-105'
                      : dateObj.isCurrentMonth
                      ? 'bg-pink-50/50 border-pink-200/50 text-gray-700 hover:bg-pink-100/70 hover:border-pink-300 hover:scale-105'
                      : 'bg-gray-50/30 border-gray-200/30 text-gray-400 opacity-50'
                  }
                `}
              >
                <span className={emotionEmoji ? 'text-2xl mb-1' : ''}>{dateObj.day}</span>
                {emotionEmoji && (
                  <span className="text-3xl">{emotionEmoji}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
