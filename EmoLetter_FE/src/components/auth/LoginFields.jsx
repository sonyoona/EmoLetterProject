import TextField from '../common/TextField';

const LoginFields = ({ values, errors, onChange }) => (
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
      label="비밀번호"
      type="password"
      value={values.password}
      onChange={(event) => onChange('password', event.target.value)}
      error={errors.password}
      placeholder="비밀번호를 입력하세요"
      autoComplete="current-password"
    />
  </>
);

export default LoginFields;
