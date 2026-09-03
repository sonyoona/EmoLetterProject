import Button from '../common/Button';
import { useAuth } from '../../contexts/AuthContext';

const AuthActions = ({ onLoginClick, onSignupClick }) => {
  const { isAuthenticated, initializing, user, logout } = useAuth();

  // 저장된 토큰으로 사용자 정보를 복구하는 동안에는 로그인 버튼이 깜빡이지 않게 자리만 잡아둔다.
  if (initializing) {
    return <div className="h-11 w-40" aria-hidden />;
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline text-sm text-gray-600">
          <b className="text-pink-500">{user?.nickname || user?.userId}</b>님
        </span>
        <Button variant="purple" size="md" onClick={logout}>
          로그아웃
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <Button variant="pink" size="md" onClick={onLoginClick}>
        로그인
      </Button>
      <Button variant="purple" size="md" onClick={onSignupClick}>
        회원가입
      </Button>
    </div>
  );
};

export default AuthActions;
