import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as diaryApi from '../api/diaryApi';
import { useAuth } from './AuthContext';
import { toDateKey } from '../utils/date';

const DiaryContext = createContext(null);

export const DiaryProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [diaries, setDiaries] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setDiaries({});
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const list = await diaryApi.fetchDiaries();
      // 같은 날짜에 여러 건이 있으면 가장 최근 것만 보여준다.
      setDiaries(
        list.reduce((acc, diary) => {
          if (!diary.date) return acc;
          acc[toDateKey(diary.date)] = diary;
          return acc;
        }, {})
      );
    } catch (err) {
      setError(err.message);
      setDiaries({});
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getDiary = useCallback((date) => (date ? diaries[toDateKey(date)] || null : null), [diaries]);

  /** 같은 날짜에 이미 일기가 있으면 수정, 없으면 새로 저장한다. */
  const saveDiary = useCallback(
    async (date, emotion, content) => {
      const existing = diaries[toDateKey(date)];
      if (existing?.id) {
        await diaryApi.updateDiary(existing.id, { date, emotion, content });
      } else {
        await diaryApi.createDiary({ date, emotion, content });
      }
      await refresh();
    },
    [diaries, refresh]
  );

  const removeDiary = useCallback(
    async (diaryId) => {
      await diaryApi.deleteDiary(diaryId);
      await refresh();
    },
    [refresh]
  );

  const value = useMemo(
    () => ({ diaries, loading, error, getDiary, saveDiary, removeDiary, refresh }),
    [diaries, loading, error, getDiary, saveDiary, removeDiary, refresh]
  );

  return <DiaryContext.Provider value={value}>{children}</DiaryContext.Provider>;
};

export const useDiary = () => {
  const context = useContext(DiaryContext);
  if (!context) {
    throw new Error('useDiary must be used within a DiaryProvider');
  }
  return context;
};
