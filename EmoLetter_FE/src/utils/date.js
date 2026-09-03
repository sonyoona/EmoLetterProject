/** 달력/일기 저장의 키로 쓰는 'YYYY-MM-DD' 문자열 */
export const toDateKey = (date) => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

/** 'YYYY년 M월 D일' */
export const formatKoreanDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
};

/** 'YYYY.MM.DD' */
export const formatDotDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}.${month}.${day}`;
};

/**
 * 백엔드의 LocalDateTime으로 보낼 수 있는 'YYYY-MM-DDTHH:mm:ss' 문자열.
 * toISOString()은 UTC로 바꿔버려 날짜가 하루 밀릴 수 있으므로 직접 만든다.
 */
export const toLocalDateTimeString = (date) => {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, '0');
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  );
};

/** <input type="date">에 넣을 수 있는 'YYYY-MM-DD' */
export const toDateInputValue = (date) => (date ? toDateKey(date) : '');

/** 'YYYY-MM-DD'(input 값)를 그 날 00:00 기준 LocalDateTime 문자열로 */
export const dateInputToLocalDateTime = (value) => `${value}T00:00:00`;

export const isPastOrToday = (date) => new Date(date).getTime() <= Date.now();

/**
 * 'YYYY-MM-DD' 형식의 내일 날짜.
 *
 * 편지 수정에서 받을 날짜의 하한으로 쓴다. 날짜 input은 시각이 없어 00:00으로 저장되는데,
 * 오늘을 고르면 "오늘 00:00" = 이미 지난 시각이라 서버가 도착한 편지로 보고 거절한다.
 */
export const tomorrowInputValue = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return toDateInputValue(d);
};
