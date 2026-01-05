import { useEffect } from 'react';

const Landing = ({ onEnter }) => {
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        if (onEnter) {
          onEnter();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onEnter]);

  const handleClick = () => {
    if (onEnter) {
      onEnter();
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen px-4 cursor-pointer relative overflow-hidden"
      onClick={handleClick}
    >
      {/* 배경 장식 요소 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-100/20 rounded-full blur-3xl"></div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="text-center space-y-8 relative z-10 animate-fade-in">
        <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
          Diarise & Daydreams
        </h1>
        <div className="space-y-4">
          <p className="text-3xl md:text-4xl text-purple-300 font-light">현실과 상상을 오가는</p>
          <p className="text-3xl md:text-4xl text-pink-300 font-light">아기자기한 무드</p>
        </div>
        <p className="text-4xl md:text-5xl font-semibold text-purple-200 mt-12">Record your EmoLetter!</p>
        <div className="mt-16 pt-8 border-t border-pink-200/30">
          <p className="text-sm text-pink-400/80 animate-pulse">Enter 키를 누르거나 화면을 클릭하세요</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
