import Card from './Card';

/** 로그인해야 볼 수 있는 화면에서 공통으로 쓰는 안내 */
const AuthRequired = ({ message = '로그인 후 이용할 수 있어요.', onLoginClick }) => (
  <Card className="p-10 text-center space-y-4 max-w-lg mx-auto">
    <p className="text-4xl">🔒</p>
    <p className="text-lg text-gray-700">{message}</p>
    {onLoginClick && (
      <button
        onClick={onLoginClick}
        className="text-pink-500 font-semibold underline hover:text-pink-600"
      >
        로그인하기
      </button>
    )}
  </Card>
);

export default AuthRequired;
