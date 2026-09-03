import { useMemo } from 'react';
import AuthRequired from '../common/AuthRequired';
import Card from '../common/Card';
import PageHeader from '../common/PageHeader';
import DangerZone from './DangerZone';
import NicknameForm from './NicknameForm';
import PasswordForm from './PasswordForm';
import ProfileSummary from './ProfileSummary';
import SettingsSection from './SettingsSection';
import StatCard from './StatCard';
import { useAuth } from '../../contexts/AuthContext';
import { useDiary } from '../../contexts/DiaryContext';
import { useLetter } from '../../contexts/LetterContext';

const MyPage = ({ onLoginClick, onAccountDeleted }) => {
  const { user, isAuthenticated } = useAuth();
  const { diaries } = useDiary();
  const { sentLetters, receivedLetters } = useLetter();

  const stats = useMemo(
    () => ({
      diaries: Object.keys(diaries).length,
      sent: sentLetters.length,
      received: receivedLetters.length,
    }),
    [diaries, sentLetters, receivedLetters]
  );

  if (!isAuthenticated) {
    return <AuthRequired message="마이페이지는 로그인 후 볼 수 있어요." onLoginClick={onLoginClick} />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <PageHeader title="마이페이지" subtitle="나의 감정 기록과 편지를 한눈에 확인하세요" />

      <Card className="p-8 space-y-6">
        <ProfileSummary user={user} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="일기 작성" value={stats.diaries} tone="pink" />
          <StatCard label="보낸 편지" value={stats.sent} tone="purple" />
          <StatCard label="받은 편지" value={stats.received} tone="amber" />
        </div>
      </Card>

      <Card className="p-8 space-y-6">
        <h2 className="text-xl font-bold text-gray-800">계정 설정</h2>

        <SettingsSection
          title="닉네임"
          description="편지에 표시되는 이름이에요"
          divider={false}
        >
          <NicknameForm />
        </SettingsSection>

        <SettingsSection title="비밀번호" description="주기적으로 바꾸면 더 안전해요">
          <PasswordForm />
        </SettingsSection>
      </Card>

      <DangerZone onDeleted={onAccountDeleted} />
    </div>
  );
};

export default MyPage;
