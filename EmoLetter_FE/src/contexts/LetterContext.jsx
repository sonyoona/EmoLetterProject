import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as letterApi from '../api/letterApi';
import { useAuth } from './AuthContext';
import { isArrived } from '../utils/letter';

const LetterContext = createContext(null);

export const LetterProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setLetters([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setLetters(await letterApi.fetchAllLetters());
    } catch (err) {
      setError(err.message);
      setLetters([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const sendLetter = useCallback(
    async ({ title, content, deliverDate, noteCode }) => {
      await letterApi.createLetter({ title, content, deliverDate, noteCode });
      await refresh();
    },
    [refresh]
  );

  /** 상세 조회하면 백엔드에서 읽음 처리까지 같이 된다. */
  const openLetter = useCallback(async (letterId) => {
    const letter = await letterApi.openLetter(letterId);
    setLetters((prev) => prev.map((item) => (item.id === letter.id ? letter : item)));
    return letter;
  }, []);

  const editLetter = useCallback(
    async (letterId, { title, content, deliverDate, noteCode }) => {
      const updated = await letterApi.updateLetter(letterId, { title, content, deliverDate, noteCode });
      // 목록 전체를 다시 부르지 않고 바뀐 한 건만 갈아끼운다.
      setLetters((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      return updated;
    },
    []
  );

  const removeLetter = useCallback(
    async (letterId) => {
      await letterApi.deleteLetter(letterId);
      await refresh();
    },
    [refresh]
  );

  const receivedLetters = useMemo(() => letters.filter(isArrived), [letters]);

  const value = useMemo(
    () => ({
      sentLetters: letters,
      receivedLetters,
      loading,
      error,
      sendLetter,
      openLetter,
      editLetter,
      removeLetter,
      refresh,
    }),
    [letters, receivedLetters, loading, error, sendLetter, openLetter, editLetter, removeLetter, refresh]
  );

  return <LetterContext.Provider value={value}>{children}</LetterContext.Provider>;
};

export const useLetter = () => {
  const context = useContext(LetterContext);
  if (!context) {
    throw new Error('useLetter must be used within a LetterProvider');
  }
  return context;
};
