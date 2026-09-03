import { useCallback, useState } from 'react';
import { VIEWS } from '../constants/views';

/**
 * 화면 전환 상태를 한 곳에 모아둔다.
 * writeMode는 달력에서 날짜를 눌렀을 때 일기로 갈지 편지로 갈지를 기억한다.
 */
export const useAppNavigation = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [currentView, setCurrentView] = useState(VIEWS.CALENDAR);
  const [selectedDate, setSelectedDate] = useState(null);
  const [writeMode, setWriteMode] = useState('diary');

  const goHome = useCallback(() => {
    setCurrentView(VIEWS.CALENDAR);
    setSelectedDate(null);
    setWriteMode('diary');
  }, []);

  const enterFromLanding = useCallback(() => {
    setShowLanding(false);
    goHome();
  }, [goHome]);

  const selectDate = useCallback(
    (date) => {
      setSelectedDate(date);
      setCurrentView(writeMode === 'letter' ? VIEWS.LETTER_WRITE : VIEWS.DIARY_WRITE);
    },
    [writeMode]
  );

  const selectMenu = useCallback((view) => {
    setSelectedDate(null);
    setCurrentView(view);
    setWriteMode(view === VIEWS.LETTER_WRITE ? 'letter' : 'diary');
  }, []);

  const goToSent = useCallback(() => {
    setCurrentView(VIEWS.SENT);
    setSelectedDate(null);
  }, []);

  return {
    showLanding,
    currentView,
    selectedDate,
    enterFromLanding,
    goHome,
    selectDate,
    selectMenu,
    goToSent,
  };
};

export default useAppNavigation;
