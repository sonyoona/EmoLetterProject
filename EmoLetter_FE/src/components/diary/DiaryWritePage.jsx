import { useState } from 'react';
import BackButton from '../common/BackButton';
import Button from '../common/Button';
import Card from '../common/Card';
import GradientHeading from '../common/GradientHeading';
import { ErrorMessage } from '../common/StatusMessage';
import EmotionPicker from './EmotionPicker';
import { useDiary } from '../../contexts/DiaryContext';
import { formatKoreanDate } from '../../utils/date';

const DiaryWritePage = ({ selectedDate, onBack, onSaved }) => {
  const { getDiary, saveDiary } = useDiary();
  const existingDiary = getDiary(selectedDate);

  const [emotion, setEmotion] = useState(existingDiary?.emotion || '');
  const [content, setContent] = useState(existingDiary?.content || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const canSave = Boolean(emotion) && content.trim().length > 0 && !saving;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    setError(null);
    try {
      await saveDiary(selectedDate, emotion, content.trim());
      onSaved?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <BackButton onClick={onBack} />

      <Card className="p-8 space-y-8">
        <div>
          <GradientHeading className="text-3xl text-center block">
            {formatKoreanDate(selectedDate)}
          </GradientHeading>
          <p className="text-center text-pink-400/70 mt-2">
            {existingDiary ? '기록한 일기를 수정할 수 있어요' : '오늘의 감정과 일기를 기록하세요'}
          </p>
        </div>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <EmotionPicker value={emotion} onChange={setEmotion} />

        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-4">일기 작성</label>
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="w-full h-64 p-4 border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 resize-none"
            placeholder="오늘 하루를 기록해보세요..."
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="neutral" onClick={onBack}>
            취소
          </Button>
          <Button variant="gradient" onClick={handleSave} disabled={!canSave}>
            {saving ? '저장 중...' : '저장하기'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default DiaryWritePage;
