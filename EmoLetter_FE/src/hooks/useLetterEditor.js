import { useCallback, useState } from 'react';
import { useLetter } from '../contexts/LetterContext';
import { isEditable } from '../utils/letter';

/**
 * 편지 수정·삭제 창의 상태를 모아둔다. (useLetterReader와 같은 역할, 다른 동작)
 *
 * 화면 컴포넌트가 "무엇을 열어뒀는지 / 저장 중인지 / 에러가 무엇인지"를
 * 각자 useState로 들고 있으면 같은 코드가 페이지마다 반복되므로 여기로 뺐다.
 */
export const useLetterEditor = () => {
  const { editLetter, removeLetter } = useLetter();

  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const openEdit = useCallback((letter) => {
    // 목록에서 이미 걸러내지만, 도착한 편지가 들어오면 창을 열지 않는다.
    if (!isEditable(letter)) {
      setError('이미 도착한 편지는 수정할 수 없어요.');
      return;
    }
    setError(null);
    setEditing(letter);
  }, []);

  const openDelete = useCallback((letter) => {
    setError(null);
    setDeleting(letter);
  }, []);

  const close = useCallback(() => {
    if (busy) return;
    setEditing(null);
    setDeleting(null);
    setError(null);
  }, [busy]);

  const save = useCallback(
    async (values) => {
      if (!editing) return;
      setBusy(true);
      setError(null);
      try {
        await editLetter(editing.id, values);
        setEditing(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setBusy(false);
      }
    },
    [editing, editLetter]
  );

  const confirmDelete = useCallback(async () => {
    if (!deleting) return;
    setBusy(true);
    setError(null);
    try {
      await removeLetter(deleting.id);
      setDeleting(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }, [deleting, removeLetter]);

  return { editing, deleting, busy, error, openEdit, openDelete, close, save, confirmDelete };
};

export default useLetterEditor;
