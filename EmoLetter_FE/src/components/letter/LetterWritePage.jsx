import { useState } from 'react';
import BackButton from '../common/BackButton';
import Button from '../common/Button';
import Card from '../common/Card';
import GradientHeading from '../common/GradientHeading';
import { ErrorMessage } from '../common/StatusMessage';
import NotePicker from './NotePicker';
import TextField from '../common/TextField';
import { useLetter } from '../../contexts/LetterContext';
import { DEFAULT_NOTE_CODE } from '../../constants/notes';
import { formatKoreanDate, toDateInputValue } from '../../utils/date';

const LetterWritePage = ({ selectedDate, onBack, onSent }) => {
  const { sendLetter } = useLetter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [noteCode, setNoteCode] = useState(DEFAULT_NOTE_CODE);
  const [deliverDate, setDeliverDate] = useState(toDateInputValue(selectedDate));
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const today = toDateInputValue(new Date());
  const canSend =
    title.trim().length > 0 && content.trim().length > 0 && Boolean(deliverDate) && !sending;

  const handleSend = async () => {
    if (!canSend) return;
    setSending(true);
    setError(null);
    try {
      await sendLetter({ title: title.trim(), content: content.trim(), deliverDate, noteCode });
      setTitle('');
      setContent('');
      onSent?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <BackButton onClick={onBack} />

      <Card className="p-8 space-y-6">
        <div>
          <GradientHeading className="text-3xl text-center block">
            미래의 나에게 편지쓰기
          </GradientHeading>
          <p className="text-center text-pink-400/70 mt-2">언제 받고 싶은지 날짜를 선택하세요</p>
        </div>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-3">받을 날짜</label>
          <input
            type="date"
            value={deliverDate}
            min={today}
            onChange={(event) => setDeliverDate(event.target.value)}
            className="w-full p-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
          />
          {deliverDate && (
            <p className="mt-2 text-purple-500 text-sm">
              {formatKoreanDate(deliverDate)}에 편지를 받을 수 있습니다
            </p>
          )}
        </div>

        <TextField
          label="제목"
          tone="purple"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="편지 제목을 입력하세요"
        />

        <NotePicker value={noteCode} onChange={setNoteCode} />

        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-3">편지 내용</label>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="w-full h-64 p-4 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 resize-none"
            placeholder="미래의 나에게 전하고 싶은 말을 적어보세요..."
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="neutral" onClick={onBack}>
            취소
          </Button>
          <Button variant="purple" onClick={handleSend} disabled={!canSend}>
            {sending ? '보내는 중...' : '편지 보내기'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LetterWritePage;
