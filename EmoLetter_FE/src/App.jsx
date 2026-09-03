import AppLayout from './components/layout/AppLayout';
import { AuthProvider } from './contexts/AuthContext';
import { DiaryProvider } from './contexts/DiaryContext';
import { LetterProvider } from './contexts/LetterContext';

const App = () => (
  <AuthProvider>
    <DiaryProvider>
      <LetterProvider>
        <AppLayout />
      </LetterProvider>
    </DiaryProvider>
  </AuthProvider>
);

export default App;
