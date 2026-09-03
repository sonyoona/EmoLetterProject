import { useEffect, useState } from 'react';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { ErrorMessage } from '../common/StatusMessage';
import AuthTabs from './AuthTabs';
import LoginFields from './LoginFields';
import SignupFields from './SignupFields';
import useAuthForm from './useAuthForm';

const LoginModal = ({ isOpen, onClose, mode = 'login' }) => {
  const [activeMode, setActiveMode] = useState(mode);
  const form = useAuthForm({ mode: activeMode, onSuccess: onClose });

  useEffect(() => {
    if (isOpen) setActiveMode(mode);
  }, [isOpen, mode]);

  const handleTabChange = (nextMode) => {
    setActiveMode(nextMode);
    form.reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <AuthTabs mode={activeMode} onChange={handleTabChange} />

      <form onSubmit={form.handleSubmit} className="space-y-5">
        {form.submitError && <ErrorMessage>{form.submitError}</ErrorMessage>}

        {activeMode === 'login' ? (
          <LoginFields values={form.values} errors={form.errors} onChange={form.handleChange} />
        ) : (
          <SignupFields values={form.values} errors={form.errors} onChange={form.handleChange} />
        )}

        <div className="flex gap-3 justify-end pt-6">
          <Button variant="neutral" onClick={onClose}>
            취소
          </Button>
          <Button
            type="submit"
            variant={activeMode === 'login' ? 'pink' : 'purple'}
            disabled={form.submitting}
          >
            {form.submitting ? '처리 중...' : activeMode === 'login' ? '로그인' : '회원가입'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default LoginModal;
