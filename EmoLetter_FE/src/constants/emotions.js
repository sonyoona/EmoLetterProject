/**
 * 프런트의 감정 선택 = 백엔드 Diary.emojiCode (문자열 컬럼)
 * code 값을 그대로 emojiCode로 주고받는다.
 */
export const EMOTIONS = [
  { code: 'HAPPY', emoji: '😊', label: '행복' },
  { code: 'SAD', emoji: '😢', label: '슬픔' },
  { code: 'ANGRY', emoji: '😠', label: '화남' },
  { code: 'ANXIOUS', emoji: '😰', label: '불안' },
  { code: 'EXCITED', emoji: '🤩', label: '신남' },
  { code: 'CALM', emoji: '😌', label: '평온' },
  { code: 'LOVE', emoji: '🥰', label: '사랑' },
  { code: 'TIRED', emoji: '😴', label: '피곤' },
];

const EMOTION_BY_CODE = Object.fromEntries(EMOTIONS.map((emotion) => [emotion.code, emotion]));

export const getEmotion = (code) => EMOTION_BY_CODE[code] || null;

/** 알 수 없는 코드가 저장돼 있어도 달력이 비어 보이지 않도록 기본 이모지를 준다. */
export const getEmotionEmoji = (code) => {
  if (!code) return null;
  return EMOTION_BY_CODE[code]?.emoji || '📝';
};
