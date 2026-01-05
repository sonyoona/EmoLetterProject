import { useState } from 'react';
import { useLetter } from '../contexts/LetterContext';

const SentLetters = () => {
  const { sentLetters } = useLetter();
  const [filter, setFilter] = useState('all'); // all, read, unread

  const filteredLetters = sentLetters.filter((letter) => {
    if (filter === 'read') return letter.isRead;
    if (filter === 'unread') return !letter.isRead;
    return true;
  });

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
        보낸 편지함
      </h2>

      {/* 필터 토글 */}
      <div className="mb-8 flex justify-center gap-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
            filter === 'all'
              ? 'bg-gradient-to-r from-purple-300 to-purple-400 text-white shadow-md'
              : 'bg-white border-2 border-purple-200 text-purple-600 hover:bg-purple-50'
          }`}
        >
          전체 편지함 ({sentLetters.length})
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
            filter === 'read'
              ? 'bg-gradient-to-r from-purple-300 to-purple-400 text-white shadow-md'
              : 'bg-white border-2 border-purple-200 text-purple-600 hover:bg-purple-50'
          }`}
        >
          읽은 편지함 ({sentLetters.filter((l) => l.isRead).length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
            filter === 'unread'
              ? 'bg-gradient-to-r from-purple-300 to-purple-400 text-white shadow-md'
              : 'bg-white border-2 border-purple-200 text-purple-600 hover:bg-purple-50'
          }`}
        >
          읽지 않은 편지함 ({sentLetters.filter((l) => !l.isRead).length})
        </button>
      </div>

      {/* 편지 목록 */}
      <div className="space-y-4">
        {filteredLetters.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl">편지가 없습니다</p>
          </div>
        ) : (
          filteredLetters.map((letter) => (
            <div
              key={letter.id}
              className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-purple-100/50 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{letter.title}</h3>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>보낸 날짜: {formatDate(letter.sentDate)}</span>
                    <span>받을 날짜: {formatDate(letter.targetDate)}</span>
                  </div>
                </div>
                {letter.isRead ? (
                  <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                    읽음
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm font-medium">
                    읽지 않음
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SentLetters;

