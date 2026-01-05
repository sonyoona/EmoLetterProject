import { createContext, useContext, useState } from 'react';

const DiaryContext = createContext();

export const DiaryProvider = ({ children }) => {
  const [diaries, setDiaries] = useState({});

  const addDiary = (date, emotion, content) => {
    const dateKey = formatDateKey(date);
    setDiaries((prev) => ({
      ...prev,
      [dateKey]: { emotion, content, date },
    }));
  };

  const getDiary = (date) => {
    const dateKey = formatDateKey(date);
    return diaries[dateKey] || null;
  };

  const formatDateKey = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const value = {
    diaries,
    addDiary,
    getDiary,
  };

  return <DiaryContext.Provider value={value}>{children}</DiaryContext.Provider>;
};

export const useDiary = () => {
  const context = useContext(DiaryContext);
  if (!context) {
    throw new Error('useDiary must be used within a DiaryProvider');
  }
  return context;
};

