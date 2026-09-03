import { api } from './http';
import { toLocalDateTimeString } from '../utils/date';

/** 백엔드 DiaryResponse -> 프런트 일기 모델 */
export const toDiary = (response) => ({
  id: response.diaryId ?? null,
  content: response.content ?? '',
  emotion: response.emojiCode ?? '',
  date: response.createAt ? new Date(response.createAt) : null,
  nickname: response.nickname ?? '',
});

/** GET /api/diary — 내 일기 전체 */
export const fetchDiaries = async () => {
  const data = await api.get('/diary');
  return (data || []).map(toDiary);
};

/** POST /api/diary */
export const createDiary = ({ date, emotion, content }) =>
  api.post('/diary', {
    content,
    emojiCode: emotion,
    createAt: toLocalDateTimeString(date),
  });

/** PUT /api/diary/{diaryId} */
export const updateDiary = (diaryId, { date, emotion, content }) =>
  api.put(`/diary/${diaryId}`, {
    content,
    emojiCode: emotion,
    createAt: toLocalDateTimeString(date),
  });

/** DELETE /api/diary/{diaryId} */
export const deleteDiary = (diaryId) => api.del(`/diary/${diaryId}`);
