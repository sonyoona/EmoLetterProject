import { useCallback, useRef, useState } from 'react';
import useClickOutside from '../../hooks/useClickOutside';
import AuthActions from './AuthActions';
import HeaderMenu from './HeaderMenu';
import HomeButton from './HomeButton';

const Header = ({ onHomeClick, onLoginClick, onSignupClick, onMenuSelect }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const closeMenu = useCallback(() => setShowMenu(false), []);
  useClickOutside(menuRef, closeMenu);

  const handleSelect = (view) => {
    onMenuSelect(view);
    closeMenu();
  };

  return (
    <header className="w-full bg-white/90 backdrop-blur-md shadow-sm border-b border-pink-100 sticky top-0 z-40">
      <div className="px-6 py-4 flex justify-between items-center">
        {/* 왼쪽: 홈 버튼 및 토글 메뉴 */}
        <div className="relative" ref={menuRef}>
          <HomeButton
            onClick={onHomeClick}
            onOpenMenu={() => setShowMenu(true)}
            menuExpanded={showMenu}
          />
          {showMenu && <HeaderMenu onSelect={handleSelect} onMouseEnter={() => setShowMenu(true)} />}
        </div>

        {/* 오른쪽: 로그인/회원가입 또는 로그아웃 */}
        <AuthActions onLoginClick={onLoginClick} onSignupClick={onSignupClick} />
      </div>
    </header>
  );
};

export default Header;
