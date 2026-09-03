import { useState } from 'react';
import Header from './Header';
import ViewRouter from './ViewRouter';
import Landing from '../landing/Landing';
import LoginModal from '../auth/LoginModal';
import useAppNavigation from '../../hooks/useAppNavigation';

const AppLayout = () => {
  const navigation = useAppNavigation();
  const [loginModal, setLoginModal] = useState({ open: false, mode: 'login' });

  const openLogin = (mode = 'login') => setLoginModal({ open: true, mode });
  const closeLogin = () => setLoginModal((prev) => ({ ...prev, open: false }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-purple-50">
      {!navigation.showLanding && (
        <Header
          onHomeClick={navigation.goHome}
          onLoginClick={() => openLogin('login')}
          onSignupClick={() => openLogin('signup')}
          onMenuSelect={navigation.selectMenu}
        />
      )}

      <main
        className={
          navigation.showLanding
            ? ''
            : 'flex justify-center items-start min-h-[calc(100vh-80px)] px-4 py-12'
        }
      >
        {navigation.showLanding ? (
          <Landing onEnter={navigation.enterFromLanding} />
        ) : (
          <div className="w-full max-w-6xl">
            <ViewRouter navigation={navigation} onLoginClick={() => openLogin('login')} />
          </div>
        )}
      </main>

      <LoginModal isOpen={loginModal.open} onClose={closeLogin} mode={loginModal.mode} />
    </div>
  );
};

export default AppLayout;
