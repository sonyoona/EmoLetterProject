import { useCallback, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { validateLogin, validateSignup } from './authValidation';

const EMPTY_FORM = {
  userId: '',
  nickname: '',
  email: '',
  password: '',
  confirmPassword: '',
};

/** 로그인/회원가입 폼의 값·검증·제출을 한 곳에서 관리한다. */
export const useAuthForm = ({ mode, onSuccess }) => {
  const { login, signup } = useAuth();
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const reset = useCallback(() => {
    setValues(EMPTY_FORM);
    setErrors({});
    setSubmitError(null);
  }, []);

  const handleChange = useCallback((field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: '' } : prev));
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const nextErrors = mode === 'login' ? validateLogin(values) : validateSignup(values);
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) return;

      setSubmitting(true);
      setSubmitError(null);
      try {
        if (mode === 'login') {
          await login({ userId: values.userId.trim(), password: values.password });
        } else {
          await signup({
            userId: values.userId.trim(),
            email: values.email.trim(),
            nickname: values.nickname.trim(),
            password: values.password,
          });
        }
        reset();
        onSuccess?.();
      } catch (err) {
        setSubmitError(err.message);
      } finally {
        setSubmitting(false);
      }
    },
    [mode, values, login, signup, reset, onSuccess]
  );

  return { values, errors, submitError, submitting, handleChange, handleSubmit, reset };
};

export default useAuthForm;
