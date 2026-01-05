import { useState } from 'react';
import { useDiary } from '../contexts/DiaryContext';

const DiaryWrite = ({ selectedDate, onBack, onSave }) => {
  const { addDiary, getDiary } = useDiary();
  const existingDiary = getDiary(selectedDate);
  const [selectedEmotion, setSelectedEmotion] = useState(existingDiary?.emotion || '');
  const [content, setContent] = useState(existingDiary?.content || '');

  const emotions = [
    { id: 'happy', emoji: '😊', label: '행복' },
    { id: 'sad', emoji: '😢', label: '슬픔' },
    { id: 'angry', emoji: '😠', label: '화남' },
    { id: 'anxious', emoji: '😰', label: '불안' },
    { id: 'excited', emoji: '🤩', label: '신남' },
    { id: 'calm', emoji: '😌', label: '평온' },
    { id: 'love', emoji: '🥰', label: '사랑' },
    { id: 'tired', emoji: '😴', label: '피곤' },
  ];

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  const handleSave = () => {
    if (selectedEmotion && content.trim()) {
      addDiary(selectedDate, selectedEmotion, content);
      if (onSave) {
        onSave();
      }
      if (onBack) {
        onBack();
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-pink-500 hover:text-pink-600 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        돌아가기
      </button>

      <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-pink-100/50">
        <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          {formatDate(selectedDate)}
        </h2>
        <p className="text-center text-pink-400/70 mb-8">오늘의 감정과 일기를 기록하세요</p>

        {/* 감정 선택 */}
        <div className="mb-8">
          <label className="block text-lg font-semibold text-gray-700 mb-4">감정 선택</label>
          <div className="grid grid-cols-4 gap-4">
            {emotions.map((emotion) => (
              <button
                key={emotion.id}
                onClick={() => setSelectedEmotion(emotion.id)}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-200
                  ${
                    selectedEmotion === emotion.id
                      ? 'bg-gradient-to-br from-pink-300 to-purple-300 border-pink-400 scale-105 shadow-lg'
                      : 'bg-white border-pink-200 hover:border-pink-300 hover:bg-pink-50'
                  }
                `}
              >
                <div className="text-4xl mb-2">{emotion.emoji}</div>
                <div className="text-sm font-medium text-gray-700">{emotion.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 일기 작성 */}
        <div className="mb-8">
          <label className="block text-lg font-semibold text-gray-700 mb-4">일기 작성</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-64 p-4 border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-pink-400 resize-none"
            placeholder="오늘 하루를 기록해보세요..."
          />
        </div>

        {/* 저장 버튼 */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedEmotion || !content.trim()}
            className={`
              px-6 py-3 text-white rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-lg
              ${
                selectedEmotion && content.trim()
                  ? 'bg-gradient-to-r from-pink-300 to-purple-300 hover:from-pink-400 hover:to-purple-400'
                  : 'bg-gray-300 cursor-not-allowed'
              }
            `}
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiaryWrite;

