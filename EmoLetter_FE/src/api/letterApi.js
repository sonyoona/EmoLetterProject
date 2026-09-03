import { api } from './http';
import { dateInputToLocalDateTime } from '../utils/date';

/**
 * 백엔드 LetterResponse -> 프런트 편지 모델.
 * boolean 필드는 Lombok/Jackson 조합에 따라 isOpened / opened 두 형태로 올 수 있어 둘 다 받는다.
 */
export const toLetter = (response) => ({
  id: response.letterId ?? null,
  title: response.title ?? '',
  content: response.content ?? '',
  noteCode: response.noteCode ?? '',
  deliverDate: response.deliverDate ? new Date(response.deliverDate) : null,
  sentDate: response.createAt ? new Date(response.createAt) : null,
  isOpened: response.isOpened ?? response.opened ?? false,
  isDelivered: response.isDelivered ?? response.delivered ?? false,
  nickname: response.nickname ?? '',
});

/** GET /api/letter?isOpened= — isOpened 파라미터가 필수라 두 번 호출해 합친다. */
export const fetchAllLetters = async () => {
  const [opened, unopened] = await Promise.all([
    api.get('/letter', { params: { isOpened: true } }),
    api.get('/letter', { params: { isOpened: false } }),
  ]);
  return [...(opened || []), ...(unopened || [])]
    .map(toLetter)
    .sort((a, b) => (b.sentDate?.getTime() || 0) - (a.sentDate?.getTime() || 0));
};

/** GET /api/letter/{letterId} — 조회하면 백엔드에서 isOpened=true로 바뀐다. */
export const openLetter = async (letterId) => toLetter(await api.get(`/letter/${letterId}`));

/** GET /api/letter/notification — 배달됐지만 아직 안 읽은 편지 */
export const fetchPendingLetters = async () => {
  const data = await api.get('/letter/notification');
  return (data || []).map(toLetter);
};

/** POST /api/letter */
export const createLetter = ({ title, content, deliverDate, noteCode }) =>
  api.post('/letter', {
    title,
    content,
    noteCode,
    deliverDate: dateInputToLocalDateTime(deliverDate),
  });

/**
 * PUT /api/letter/{letterId}
 * 백엔드가 수정된 편지를 LetterResponse로 돌려주므로 그대로 정규화해서 쓴다.
 */
export const updateLetter = async (letterId, { title, content, deliverDate, noteCode }) =>
  toLetter(
    await api.put(`/letter/${letterId}`, {
      title,
      content,
      noteCode,
      deliverDate: dateInputToLocalDateTime(deliverDate),
    })
  );

/** DELETE /api/letter/{letterId} */
export const deleteLetter = (letterId) => api.del(`/letter/${letterId}`);
