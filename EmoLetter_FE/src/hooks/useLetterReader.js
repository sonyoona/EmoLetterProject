import { useCallback, useState } from 'react';
import { useLetter } from '../contexts/LetterContext';
import { isArrived } from '../utils/letter';

/**
 * 편지를 눌렀을 때 상세 조회(=읽음 처리)를 하고 모달 상태를 관리한다.
 * 아직 배달되지 않은 편지는 열지 않는다.
 */
export const useLetterReader = () => {
  const { openLetter } = useLetter();
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [error, setError] = useState(null);

  const open = useCallback(
    async (letter) => {
      if (!isArrived(letter)) {
        setError('아직 받을 날짜가 되지 않은 편지예요.');
        return;
      }
      setError(null);
      try {
        setSelectedLetter(await openLetter(letter.id));
      } catch (err) {
        setError(err.message);
      }
    },
    [openLetter]
  );

  const close = useCallback(() => {
    setSelectedLetter(null);
    setError(null);
  }, []);

  return { selectedLetter, error, open, close };
};

export default useLetterReader;
