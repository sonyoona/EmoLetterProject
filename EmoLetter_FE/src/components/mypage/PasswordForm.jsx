import { useState } from 'react';
import Button from '../common/Button';
import TextField from '../common/TextField';
import { ErrorMessage, SuccessMessage } from '../common/StatusMessage';
import { validatePasswordChange } from '../auth/authValidation';
import { useAuth } from '../../contexts/AuthContext';

const EMPTY = { oldPassword: '', newPassword: '', confirmPassword: '' };

const PasswordForm = () => {
  const { changePassword } = useAuth();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (field) => (event) => {
    const { value } = event.target;
    setValues((prev) => ({ ...prev, [field]: value }));
    // 고치기 시작하면 그 칸의 에러는 지운다.
    setErrors((prev) => (prev[field] ? { ...prev, [field]: '' } : prev));
    setDone(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validatePasswordChange(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    setSubmitError(null);
    try {
      await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      // 성공하면 입력값을 비운다. 화면에 비밀번호를 남겨둘 이유가 없다.
      setValues(EMPTY);
      setDone(true);
    } catch (err) {
      // 현재 비밀번호가 틀리면 서버가 401 + 사용자용 문구를 보낸다.
      setSubmitError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const filled = values.oldPassword && values.newPassword && values.confirmPassword;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {submitError && <ErrorMessage>{submitError}</ErrorMessage>}
      {done && <SuccessMessage>비밀번호를 변경했어요. 다음 로그인부터 새 비밀번호를 사용하세요.</SuccessMessage>}

      <TextField
        label="현재 비밀번호"
        type="password"
        autoComplete="current-password"
        value={values.oldPassword}
        onChange={handleChange('oldPassword')}
        error={errors.oldPassword}
        placeholder="현재 비밀번호"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          label="새 비밀번호"
          tone="purple"
          type="password"
          autoComplete="new-password"
          value={values.newPassword}
          onChange={handleChange('newPassword')}
          error={errors.newPassword}
          placeholder="6자 이상"
        />
        <TextField
          label="새 비밀번호 확인"
          tone="purple"
          type="password"
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={handleChange('confirmPassword')}
          error={errors.confirmPassword}
          placeholder="한 번 더 입력"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="purple" disabled={!filled || saving}>
          {saving ? '변경 중...' : '비밀번호 변경'}
        </Button>
      </div>
    </form>
  );
};

export default PasswordForm;
