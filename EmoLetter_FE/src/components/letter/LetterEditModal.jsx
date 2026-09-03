import { useEffect, useState } from 'react';
import Button from '../common/Button';
import Modal from '../common/Modal';
import TextField from '../common/TextField';
import { ErrorMessage } from '../common/StatusMessage';
import NotePicker from './NotePicker';
import { DEFAULT_NOTE_CODE } from '../../constants/notes';
import { formatKoreanDate, toDateInputValue, tomorrowInputValue } from '../../utils/date';

const EMPTY = { title: '', content: '', deliverDate: '', noteCode: DEFAULT_NOTE_CODE };

/**
 * 아직 도착하지 않은 편지를 고치는 창.
 *
 * 보내기 화면과 입력 항목이 같지만 따로 둔 이유:
 *  - 여기는 "받을 날짜"의 하한이 내일이다. (오늘로 고치면 서버가 도착한 편지로 보고 거절한다)
 *  - 보내기는 전체 화면, 수정은 목록 위에 뜨는 모달이라 레이아웃이 다르다.
 */
const LetterEditModal = ({ letter, error, busy, onSave, onClose }) => {
  const [form, setForm] = useState(EMPTY);
  const minDate = tomorrowInputValue();

  // 편지가 바뀔 때마다 폼을 그 편지 값으로 초기화한다.
  useEffect(() => {
    if (!letter) return;
    setForm({
      title: letter.title || '',
      content: letter.content || '',
      deliverDate: toDateInputValue(letter.deliverDate),
      noteCode: letter.noteCode || DEFAULT_NOTE_CODE,
    });
  }, [letter]);

  const set = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }));

  const canSave =
    !busy &&
    form.title.trim().length > 0 &&
    form.content.trim().length > 0 &&
    Boolean(form.deliverDate) &&
    form.deliverDate >= minDate;

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      title: form.title.trim(),
      content: form.content.trim(),
      deliverDate: form.deliverDate,
      noteCode: form.noteCode,
    });
  };

  return (
    <Modal isOpen={Boolean(letter)} onClose={busy ? () => {} : onClose} className="max-w-2xl">
      <div className="space-y-5 max-h-[80vh] overflow-y-auto pr-1">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">편지 고쳐 쓰기</h3>
          <p className="mt-1.5 text-sm text-gray-500">
            아직 도착하지 않은 편지만 고칠 수 있어요
          </p>
        </div>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <div>
          <label className="block mb-2 text-gray-700 font-semibold">받을 날짜</label>
          <input
            type="date"
            value={form.deliverDate}
            min={minDate}
            onChange={(event) => set('deliverDate')(event.target.value)}
            className="w-full p-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
          />
          <p className="mt-2 text-sm text-purple-500">
            {form.deliverDate && form.deliverDate >= minDate
              ? `${formatKoreanDate(form.deliverDate)}에 편지를 받을 수 있습니다`
              : '내일 이후의 날짜만 고를 수 있어요'}
          </p>
        </div>

        <TextField
          label="제목"
          tone="purple"
          value={form.title}
          onChange={(event) => set('title')(event.target.value)}
          placeholder="편지 제목을 입력하세요"
        />

        <NotePicker value={form.noteCode} onChange={set('noteCode')} />

        <div>
          <label className="block mb-2 text-gray-700 font-semibold">편지 내용</label>
          <textarea
            value={form.content}
            onChange={(event) => set('content')(event.target.value)}
            className="w-full h-56 p-4 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 resize-none"
            placeholder="미래의 나에게 전하고 싶은 말을 적어보세요..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6">
        <Button variant="neutral" onClick={onClose} disabled={busy}>
          취소
        </Button>
        <Button variant="purple" onClick={handleSave} disabled={!canSave}>
          {busy ? '저장 중...' : '저장'}
        </Button>
      </div>
    </Modal>
  );
};

export default LetterEditModal;
