import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ onHomeClick, onLoginClick, onSignupClick, currentView, setCurrentView }) => {
  const { isAuthenticated, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuItemClick = (view) => {
    setCurrentView(view);
    setShowMenu(false);
  };

  return (
    <header className="w-full bg-white/90 backdrop-blur-md shadow-sm border-b border-pink-100 sticky top-0 z-40">
      <div className="px-6 py-4 flex justify-between items-center">
        {/* 왼쪽: 홈 버튼 및 토글 메뉴 */}
        <div className="relative">
          <button
            onClick={onHomeClick}
            onMouseEnter={() => setShowMenu(true)}
            onMouseLeave={() => setShowMenu(false)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-pink-300 to-purple-300 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg 
                className="w-5 h-5 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-pink-500 font-semibold">홈</span>
          </button>
          
          {/* 호버 시 표시되는 토글 메뉴 */}
          {showMenu && (
            <div 
              className="absolute top-full left-0 mt-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-pink-100 py-2 min-w-[180px] z-50 animate-fade-in"
              onMouseEnter={() => setShowMenu(true)}
              onMouseLeave={() => setShowMenu(false)}
            >
              <button
                onClick={() => {
                  handleMenuItemClick('write');
                  setShowMenu(false);
                }}
                className="w-full text-left px-5 py-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-transparent text-gray-700 transition-all duration-200 flex items-center gap-3 group"
              >
                <div className="w-2 h-2 rounded-full bg-pink-300 group-hover:scale-125 transition-transform"></div>
                <span className="font-medium">편지쓰기</span>
              </button>
              <button
                onClick={() => {
                  handleMenuItemClick('sent');
                  setShowMenu(false);
                }}
                className="w-full text-left px-5 py-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-transparent text-gray-700 transition-all duration-200 flex items-center gap-3 group"
              >
                <div className="w-2 h-2 rounded-full bg-purple-300 group-hover:scale-125 transition-transform"></div>
                <span className="font-medium">보낸 편지함</span>
              </button>
              <button
                onClick={() => {
                  handleMenuItemClick('received');
                  setShowMenu(false);
                }}
                className="w-full text-left px-5 py-3 hover:bg-gradient-to-r hover:from-pink-50 hover:to-transparent text-gray-700 transition-all duration-200 flex items-center gap-3 group"
              >
                <div className="w-2 h-2 rounded-full bg-pink-300 group-hover:scale-125 transition-transform"></div>
                <span className="font-medium">받은 편지함</span>
              </button>
            </div>
          )}
        </div>

        {/* 오른쪽: 로그인/회원가입 또는 로그아웃 */}
        <div className="flex gap-3">
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-300 to-purple-400 text-white rounded-xl hover:from-purple-400 hover:to-purple-500 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
            >
              로그아웃
            </button>
          ) : (
            <>
              <button
                onClick={onLoginClick}
                className="px-6 py-2.5 bg-gradient-to-r from-pink-300 to-pink-400 text-white rounded-xl hover:from-pink-400 hover:to-pink-500 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
              >
                로그인
              </button>
              <button
                onClick={onSignupClick}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-300 to-purple-400 text-white rounded-xl hover:from-purple-400 hover:to-purple-500 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
