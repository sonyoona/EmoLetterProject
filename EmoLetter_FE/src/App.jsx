import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { DiaryProvider } from './contexts/DiaryContext';
import { LetterProvider } from './contexts/LetterContext';
import Header from './components/Header';
import Landing from './components/Landing';
import Calendar from './components/Calendar';
import DiaryWrite from './components/DiaryWrite';
import LetterWrite from './components/LetterWrite';
import SentLetters from './components/SentLetters';
import ReceivedLetters from './components/ReceivedLetters';
import LoginModal from './components/LoginModal';

const AppContent = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [currentView, setCurrentView] = useState('calendar');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginModalMode, setLoginModalMode] = useState('login');
  const [selectedDate, setSelectedDate] = useState(null);
  const [writeMode, setWriteMode] = useState('diary'); // 'diary' or 'letter'

  const handleEnterFromLanding = () => {
    setShowLanding(false);
    setCurrentView('calendar');
  };

  const handleHomeClick = () => {
    setCurrentView('calendar');
    setSelectedDate(null);
  };

  const handleLoginClick = () => {
    setLoginModalMode('login');
    setShowLoginModal(true);
  };

  const handleSignupClick = () => {
    setLoginModalMode('signup');
    setShowLoginModal(true);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    if (currentView === 'write') {
      setCurrentView('letterWrite');
    } else {
      setCurrentView('diaryWrite');
    }
  };

  const handleMenuItemClick = (view) => {
    if (view === 'write') {
      setCurrentView('calendar');
      setWriteMode('letter');
    } else {
      setCurrentView(view);
      setSelectedDate(null);
    }
  };

  const handleBackFromWrite = () => {
    if (writeMode === 'letter') {
      setCurrentView('calendar');
    } else {
      setCurrentView('calendar');
    }
    setSelectedDate(null);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'calendar':
        return <Calendar onDateClick={handleDateClick} />;
      case 'diaryWrite':
        return (
          <DiaryWrite
            selectedDate={selectedDate}
            onBack={handleBackFromWrite}
            onSave={() => setCurrentView('calendar')}
          />
        );
      case 'letterWrite':
        return (
          <LetterWrite
            selectedDate={selectedDate}
            onBack={handleBackFromWrite}
            onSave={() => {
              setCurrentView('sent');
              setSelectedDate(null);
            }}
          />
        );
      case 'sent':
        return <SentLetters />;
      case 'received':
        return <ReceivedLetters />;
      default:
        return <Calendar onDateClick={handleDateClick} />;
    }
  };

  return (
    <DiaryProvider>
      <LetterProvider>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 via-pink-50 to-purple-50">
          {!showLanding && (
            <Header
              onHomeClick={handleHomeClick}
              onLoginClick={handleLoginClick}
              onSignupClick={handleSignupClick}
              currentView={currentView}
              setCurrentView={handleMenuItemClick}
            />
          )}
          
          <main className={showLanding ? '' : 'flex justify-center items-start min-h-[calc(100vh-80px)] px-4 py-12'}>
            {showLanding ? (
              <Landing onEnter={handleEnterFromLanding} />
            ) : (
              <div className="w-full max-w-6xl">
                {renderContent()}
              </div>
            )}
          </main>

          <LoginModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            mode={loginModalMode}
          />
        </div>
      </LetterProvider>
    </DiaryProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
