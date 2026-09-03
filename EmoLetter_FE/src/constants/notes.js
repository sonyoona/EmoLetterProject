/**
 * 편지지 종류 = 백엔드 Letter.noteCode (문자열 컬럼)
 */
export const NOTES = [
  { code: 'PINK', label: '핑크', preview: 'from-pink-200 to-pink-100', accent: 'border-pink-400' },
  { code: 'PURPLE', label: '퍼플', preview: 'from-purple-200 to-purple-100', accent: 'border-purple-400' },
  { code: 'MINT', label: '민트', preview: 'from-emerald-200 to-emerald-100', accent: 'border-emerald-400' },
  { code: 'CREAM', label: '크림', preview: 'from-amber-200 to-amber-100', accent: 'border-amber-400' },
];

export const DEFAULT_NOTE_CODE = NOTES[0].code;

const NOTE_BY_CODE = Object.fromEntries(NOTES.map((note) => [note.code, note]));

export const getNote = (code) => NOTE_BY_CODE[code] || NOTE_BY_CODE[DEFAULT_NOTE_CODE];
