import { createContext, useContext, useState } from 'react';

const LetterContext = createContext();

export const LetterProvider = ({ children }) => {
  const [sentLetters, setSentLetters] = useState([]);
  const [receivedLetters, setReceivedLetters] = useState([]);

  const sendLetter = (title, content, targetDate) => {
    const letter = {
      id: Date.now(),
      title,
      content,
      targetDate,
      sentDate: new Date(),
      isRead: false,
    };
    setSentLetters((prev) => [...prev, letter]);
    
    // 목표 날짜가 현재보다 과거면 받은 편지함에 추가
    if (new Date(targetDate) <= new Date()) {
      setReceivedLetters((prev) => [...prev, letter]);
    }
  };

  const markAsRead = (letterId) => {
    setSentLetters((prev) =>
      prev.map((letter) =>
        letter.id === letterId ? { ...letter, isRead: true } : letter
      )
    );
    setReceivedLetters((prev) =>
      prev.map((letter) =>
        letter.id === letterId ? { ...letter, isRead: true } : letter
      )
    );
  };

  const value = {
    sentLetters,
    receivedLetters,
    sendLetter,
    markAsRead,
  };

  return <LetterContext.Provider value={value}>{children}</LetterContext.Provider>;
};

export const useLetter = () => {
  const context = useContext(LetterContext);
  if (!context) {
    throw new Error('useLetter must be used within a LetterProvider');
  }
  return context;
};

