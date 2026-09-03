import TextField from '../common/TextField';

const SignupFields = ({ values, errors, onChange }) => (
  <>
    <TextField
      label="아이디"
      value={values.userId}
      onChange={(event) => onChange('userId', event.target.value)}
      error={errors.userId}
      placeholder="아이디를 입력하세요"
      autoComplete="username"
    />
    <TextField
      label="닉네임"
      tone="purple"
      value={values.nickname}
      onChange={(event) => onChange('nickname', event.target.value)}
      error={errors.nickname}
      placeholder="닉네임을 입력하세요"
    />
    <TextField
      label="이메일"
      type="email"
      tone="purple"
      value={values.email}
      onChange={(event) => onChange('email', event.target.value)}
      error={errors.email}
      placeholder="example@email.com"
      autoComplete="email"
    />
    <TextField
      label="비밀번호"
      type="password"
      tone="purple"
      value={values.password}
      onChange={(event) => onChange('password', event.target.value)}
      error={errors.password}
      placeholder="비밀번호를 입력하세요"
      autoComplete="new-password"
    />
    <TextField
      label="비밀번호 확인"
      type="password"
      tone="purple"
      value={values.confirmPassword}
      onChange={(event) => onChange('confirmPassword', event.target.value)}
      error={errors.confirmPassword}
      placeholder="비밀번호를 다시 입력하세요"
      autoComplete="new-password"
    />
  </>
);

export default SignupFields;
