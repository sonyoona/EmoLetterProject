import LetterCard from './LetterCard';
import { EmptyMessage, LoadingMessage } from '../common/StatusMessage';

/**
 * onEdit / onDelete는 선택 사항이다.
 * 받은 편지함처럼 읽기만 하는 화면은 넘기지 않으면 버튼이 아예 그려지지 않는다.
 * canEdit로 편지마다 "고쳐 쓰기"를 보여줄지 판단한다.
 */
const LetterList = ({ letters, loading, emptyMessage, isArrived, canEdit, onSelect, onEdit, onDelete }) => {
  if (loading) return <LoadingMessage />;
  if (!letters.length) return <EmptyMessage>{emptyMessage}</EmptyMessage>;

  return (
    <div className="space-y-4">
      {letters.map((letter) => (
        <LetterCard
          key={letter.id}
          letter={letter}
          arrived={isArrived(letter)}
          onClick={onSelect}
          onEdit={onEdit && canEdit?.(letter) ? onEdit : undefined}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default LetterList;
