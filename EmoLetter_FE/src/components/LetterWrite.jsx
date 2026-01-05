import { useState } from 'react';
import { useLetter } from '../contexts/LetterContext';

const LetterWrite = ({ selectedDate, onBack, onSave }) => {
  const { sendLetter } = useLetter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetDate, setTargetDate] = useState(
    selectedDate ? new Date(selectedDate).toISOString().split('T')[0] : ''
  );

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  const handleSave = () => {
    if (title.trim() && content.trim() && targetDate) {
      sendLetter(title, content, targetDate);
      setTitle('');
      setContent('');
      if (onSave) {
        onSave();
      }
      if (onBack) {
        onBack();
      }
    }
  };

  const today = new Date().toISOString().split('T')[0];

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
          미래의 나에게 편지쓰기
        </h2>
        <p className="text-center text-pink-400/70 mb-8">언제 받고 싶은지 날짜를 선택하세요</p>

        {/* 날짜 선택 */}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-700 mb-3">받을 날짜</label>
          <input
            type="date"
            value={targetDate}
            min={today}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full p-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
          />
          {targetDate && (
            <p className="mt-2 text-purple-500 text-sm">{formatDate(targetDate)}에 편지를 받을 수 있습니다</p>
          )}
        </div>

        {/* 제목 */}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-700 mb-3">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
            placeholder="편지 제목을 입력하세요"
          />
        </div>

        {/* 편지 내용 */}
        <div className="mb-8">
          <label className="block text-lg font-semibold text-gray-700 mb-3">편지 내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-64 p-4 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 resize-none"
            placeholder="미래의 나에게 전하고 싶은 말을 적어보세요..."
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
            disabled={!title.trim() || !content.trim() || !targetDate}
            className={`
              px-6 py-3 text-white rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-lg
              ${
                title.trim() && content.trim() && targetDate
                  ? 'bg-gradient-to-r from-purple-300 to-purple-400 hover:from-purple-400 hover:to-purple-500'
                  : 'bg-gray-300 cursor-not-allowed'
              }
            `}
          >
            편지 보내기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LetterWrite;

