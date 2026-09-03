import Button from '../common/Button';
import Modal from '../common/Modal';
import { ErrorMessage } from '../common/StatusMessage';
import { getNote } from '../../constants/notes';
import { formatKoreanDate } from '../../utils/date';

const LetterDetailModal = ({ letter, error, onClose }) => (
  <Modal isOpen={Boolean(letter) || Boolean(error)} onClose={onClose} className="max-w-2xl">
    {error ? (
      <ErrorMessage>{error}</ErrorMessage>
    ) : (
      letter && (
        <div className="space-y-5">
          <div className={`h-3 rounded-full bg-gradient-to-r ${getNote(letter.noteCode).preview}`} />
          {letter.title && (
            <h3 className="text-2xl font-bold text-gray-800">{letter.title}</h3>
          )}
          <div className="text-sm text-gray-500 flex gap-4 flex-wrap">
            <span>보낸 날짜: {formatKoreanDate(letter.sentDate)}</span>
            <span>받은 날짜: {formatKoreanDate(letter.deliverDate)}</span>
          </div>
          <p className="whitespace-pre-line leading-relaxed text-gray-800 max-h-[50vh] overflow-y-auto">
            {letter.content}
          </p>
          <p className="text-right text-pink-400">— {letter.nickname}</p>
        </div>
      )
    )}
    <div className="flex justify-end pt-6">
      <Button variant="neutral" onClick={onClose}>
        닫기
      </Button>
    </div>
  </Modal>
);

export default LetterDetailModal;
