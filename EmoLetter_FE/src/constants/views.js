export const VIEWS = {
  CALENDAR: 'calendar',
  DIARY_WRITE: 'diaryWrite',
  LETTER_WRITE: 'letterWrite',
  SENT: 'sent',
  RECEIVED: 'received',
  MY_PAGE: 'myPage',
};

export const MENU_ITEMS = [
  { view: VIEWS.LETTER_WRITE, label: '편지 보내기', dot: 'bg-pink-300', hover: 'hover:from-pink-50' },
  { view: VIEWS.SENT, label: '보낸 편지함', dot: 'bg-purple-300', hover: 'hover:from-purple-50' },
  { view: VIEWS.RECEIVED, label: '받은 편지함', dot: 'bg-pink-300', hover: 'hover:from-pink-50' },
  { view: VIEWS.MY_PAGE, label: '마이페이지', dot: 'bg-purple-300', hover: 'hover:from-purple-50' },
];
