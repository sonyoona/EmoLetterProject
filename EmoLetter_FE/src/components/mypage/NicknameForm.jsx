import { useState } from 'react';
import Button from '../common/Button';
import TextField from '../common/TextField';
import { ErrorMessage, SuccessMessage } from '../common/StatusMessage';
import { useAuth } from '../../contexts/AuthContext';

const NicknameForm = () => {
  const { user, updateNickname } = useAuth();
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!nickname.trim() || saving) return;

    setSaving(true);
    setError(null);
    setStatus(null);
    try {
      await updateNickname(nickname.trim());
      setStatus('닉네임을 변경했어요.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {status && <SuccessMessage>{status}</SuccessMessage>}
      <TextField
        label="새 닉네임"
        tone="purple"
        value={nickname}
        onChange={(event) => {
          setNickname(event.target.value);
          setStatus(null);
        }}
        placeholder="새 닉네임"
      />
      <div className="flex justify-end">
        <Button type="submit" variant="purple" disabled={!nickname.trim() || saving}>
          {saving ? '저장 중...' : '저장'}
        </Button>
      </div>
    </form>
  );
};

export default NicknameForm;
