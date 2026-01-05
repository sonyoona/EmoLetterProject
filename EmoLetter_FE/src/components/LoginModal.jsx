import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginModal = ({ isOpen, onClose, mode = 'login' }) => {
  const [activeMode, setActiveMode] = useState(mode);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const { login } = useAuth();

  useEffect(() => {
    setActiveMode(mode);
  }, [mode]);

  if (!isOpen) return null;

  const validateLogin = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = '사용자명을 입력해주세요.';
    }
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignup = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = '사용자명을 입력해주세요.';
    }
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
    }
    if (activeMode === 'signup' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = activeMode === 'login' ? validateLogin() : validateSignup();
    if (isValid) {
      login({ username: formData.username, email: formData.email });
      onClose();
      setFormData({ username: '', email: '', password: '', confirmPassword: '' });
      setErrors({});
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleTabChange = (newMode) => {
    setActiveMode(newMode);
    setErrors({});
    setFormData({ username: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scale-in border border-pink-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 탭 전환 */}
        <div className="flex gap-2 mb-8 bg-pink-50/50 rounded-2xl p-1">
          <button
            onClick={() => handleTabChange('login')}
            className={`flex-1 py-3 font-semibold rounded-xl transition-all duration-200 ${
              activeMode === 'login'
                ? 'bg-gradient-to-r from-pink-300 to-pink-400 text-white shadow-md'
                : 'text-pink-400 hover:text-pink-500'
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => handleTabChange('signup')}
            className={`flex-1 py-3 font-semibold rounded-xl transition-all duration-200 ${
              activeMode === 'signup'
                ? 'bg-gradient-to-r from-purple-300 to-purple-400 text-white shadow-md'
                : 'text-purple-400 hover:text-purple-500'
            }`}
          >
            회원가입
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-gray-700 font-semibold">사용자명</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className={`w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                errors.username
                  ? 'border-red-300 focus:ring-red-400 bg-red-50/50'
                  : 'border-pink-200 focus:border-pink-400 focus:ring-pink-300 bg-white'
              }`}
              placeholder="사용자명을 입력하세요"
            />
            {errors.username && <p className="text-red-500 text-sm mt-1.5">{errors.username}</p>}
          </div>

          {activeMode === 'signup' && (
            <div>
              <label className="block mb-2 text-gray-700 font-semibold">이메일</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? 'border-red-300 focus:ring-red-400 bg-red-50/50'
                    : 'border-purple-200 focus:border-purple-400 focus:ring-purple-300 bg-white'
                }`}
                placeholder="example@email.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1.5">{errors.email}</p>}
            </div>
          )}

          <div>
            <label className="block mb-2 text-gray-700 font-semibold">비밀번호</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                errors.password
                  ? 'border-red-300 focus:ring-red-400 bg-red-50/50'
                  : activeMode === 'login'
                  ? 'border-pink-200 focus:border-pink-400 focus:ring-pink-300 bg-white'
                  : 'border-purple-200 focus:border-purple-400 focus:ring-purple-300 bg-white'
              }`}
              placeholder="비밀번호를 입력하세요"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1.5">{errors.password}</p>}
          </div>

          {activeMode === 'signup' && (
            <div>
              <label className="block mb-2 text-gray-700 font-semibold">비밀번호 확인</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`w-full border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                  errors.confirmPassword
                    ? 'border-red-300 focus:ring-red-400 bg-red-50/50'
                    : 'border-purple-200 focus:border-purple-400 focus:ring-purple-300 bg-white'
                }`}
                placeholder="비밀번호를 다시 입력하세요"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1.5">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          <div className="flex gap-3 justify-end pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              className={`px-6 py-3 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-medium ${
                activeMode === 'login'
                  ? 'bg-gradient-to-r from-pink-300 to-pink-400 hover:from-pink-400 hover:to-pink-500'
                  : 'bg-gradient-to-r from-purple-300 to-purple-400 hover:from-purple-400 hover:to-purple-500'
              }`}
            >
              {activeMode === 'login' ? '로그인' : '회원가입'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
