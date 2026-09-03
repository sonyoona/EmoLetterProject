const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateLogin = ({ userId, password }) => {
  const errors = {};
  if (!userId.trim()) errors.userId = '아이디를 입력해주세요.';
  if (!password) errors.password = '비밀번호를 입력해주세요.';
  return errors;
};

export const validatePasswordChange = ({ oldPassword, newPassword, confirmPassword }) => {
  const errors = {};
  if (!oldPassword) errors.oldPassword = '현재 비밀번호를 입력해주세요.';

  if (!newPassword) {
    errors.newPassword = '새 비밀번호를 입력해주세요.';
  } else if (newPassword.length < 6) {
    errors.newPassword = '비밀번호는 최소 6자 이상이어야 합니다.';
  } else if (newPassword === oldPassword) {
    errors.newPassword = '현재 비밀번호와 다른 비밀번호를 입력해주세요.';
  }

  if (newPassword !== confirmPassword) {
    errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
  }

  return errors;
};

export const validateSignup = ({ userId, email, nickname, password, confirmPassword }) => {
  const errors = {};
  if (!userId.trim()) errors.userId = '아이디를 입력해주세요.';
  if (!nickname.trim()) errors.nickname = '닉네임을 입력해주세요.';

  if (!email.trim()) {
    errors.email = '이메일을 입력해주세요.';
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = '올바른 이메일 형식을 입력해주세요.';
  }

  if (!password) {
    errors.password = '비밀번호를 입력해주세요.';
  } else if (password.length < 6) {
    errors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
  }

  return errors;
};
