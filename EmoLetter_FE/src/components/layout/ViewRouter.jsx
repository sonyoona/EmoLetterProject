import CalendarPage from '../calendar/CalendarPage';
import DiaryWritePage from '../diary/DiaryWritePage';
import LetterWritePage from '../letter/LetterWritePage';
import ReceivedLettersPage from '../letter/ReceivedLettersPage';
import SentLettersPage from '../letter/SentLettersPage';
import MyPage from '../mypage/MyPage';
import AuthRequired from '../common/AuthRequired';
import { VIEWS } from '../../constants/views';
import { useAuth } from '../../contexts/AuthContext';

/** 로그인이 필요한 화면 */
const PROTECTED_VIEWS = [VIEWS.DIARY_WRITE, VIEWS.LETTER_WRITE, VIEWS.SENT, VIEWS.RECEIVED];

const ViewRouter = ({ navigation, onLoginClick }) => {
  const { isAuthenticated } = useAuth();
  const { currentView, selectedDate, goHome, selectDate, goToSent } = navigation;

  if (PROTECTED_VIEWS.includes(currentView) && !isAuthenticated) {
    return <AuthRequired onLoginClick={onLoginClick} />;
  }

  switch (currentView) {
    case VIEWS.DIARY_WRITE:
      return <DiaryWritePage selectedDate={selectedDate} onBack={goHome} onSaved={goHome} />;
    case VIEWS.LETTER_WRITE:
      return <LetterWritePage selectedDate={selectedDate} onBack={goHome} onSent={goToSent} />;
    case VIEWS.SENT:
      return <SentLettersPage />;
    case VIEWS.RECEIVED:
      return <ReceivedLettersPage />;
    case VIEWS.MY_PAGE:
      // 탈퇴하면 마이페이지에 머물 이유가 없다. (로그아웃 상태의 달력으로 돌아간다)
      return <MyPage onLoginClick={onLoginClick} onAccountDeleted={goHome} />;
    case VIEWS.CALENDAR:
    default:
      return <CalendarPage onDateClick={selectDate} />;
  }
};

export default ViewRouter;
