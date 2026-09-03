import LetterStatusBadge from './LetterStatusBadge';
import { getNote } from '../../constants/notes';
import { formatDotDate } from '../../utils/date';

/** 제목이 없던 시절에 쓴 편지를 위해 본문 앞부분을 요약해 제목 자리에 채운다. */
const summarize = (content) => {
  const text = (content || '').trim().replace(/\s+/g, ' ');
  if (!text) return '(내용 없음)';
  return text.length > 40 ? `${text.slice(0, 40)}...` : text;
};

const displayTitle = (letter) => letter.title?.trim() || summarize(letter.content);

const ActionButton = ({ tone, children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
      tone === 'danger'
        ? 'border-rose-200 text-rose-500 hover:bg-rose-50'
        : 'border-purple-200 text-purple-500 hover:bg-purple-50'
    }`}
  >
    {children}
  </button>
);

/**
 * 카드 전체가 <button>이던 구조를 바꿨다.
 * 수정·삭제 버튼이 생기면서 버튼 안에 버튼이 들어가는 잘못된 마크업이 되기 때문에,
 * 바깥은 <div>로 두고 "본문을 누르는 영역"만 버튼으로 남겼다.
 */
const LetterCard = ({ letter, arrived, onClick, onEdit, onDelete }) => {
  const note = getNote(letter.noteCode);
  const hasActions = Boolean(onEdit || onDelete);

  return (
    <div
      className={`bg-white/70 backdrop-blur-md rounded-2xl border transition-all hover:shadow-lg ${
        arrived && !letter.isOpened ? 'border-pink-300 shadow-md' : 'border-purple-100/50'
      }`}
    >
      <button
        type="button"
        onClick={() => onClick?.(letter)}
        className="w-full text-left p-6 rounded-2xl"
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <span className={`w-10 h-10 shrink-0 rounded-lg bg-gradient-to-br ${note.preview}`} />
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">
                {letter.isOpened || arrived ? displayTitle(letter) : '아직 열어볼 수 없는 편지'}
              </h3>
              <div className="flex gap-4 text-sm text-gray-500 flex-wrap">
                <span>보낸 날짜: {formatDotDate(letter.sentDate)}</span>
                <span>받을 날짜: {formatDotDate(letter.deliverDate)}</span>
              </div>
            </div>
          </div>
          <LetterStatusBadge isOpened={letter.isOpened} isDelivered={arrived} />
        </div>
      </button>

      {hasActions && (
        <div className="flex justify-end gap-2 px-6 pb-4 -mt-1">
          {onEdit && (
            <ActionButton onClick={() => onEdit(letter)}>고쳐 쓰기</ActionButton>
          )}
          {onDelete && (
            <ActionButton tone="danger" onClick={() => onDelete(letter)}>
              삭제
            </ActionButton>
          )}
        </div>
      )}
    </div>
  );
};

export default LetterCard;
