import { useState } from 'react';
import Button from '../common/Button';
import ConfirmDialog from '../common/ConfirmDialog';
import { useAuth } from '../../contexts/AuthContext';

/**
 * 회원 탈퇴.
 *
 * 탈퇴하면 이 계정의 일기와 편지가 함께 지워진다. (서버가 자식 데이터를 먼저 지운 뒤 계정을 지운다)
 * 되돌릴 수 없으므로 아이디를 직접 입력해야 버튼이 열리게 했다.
 */
const DangerZone = ({ onDeleted }) => {
  const { user, deleteAccount } = useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirm = async () => {
    setBusy(true);
    setError(null);
    try {
      await deleteAccount();
      setOpen(false);
      onDeleted?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const close = () => {
    if (busy) return;
    setOpen(false);
    setError(null);
  };

  return (
    <div className="rounded-3xl border border-rose-200 bg-rose-50/50 p-6 sm:p-8">
      <h3 className="text-lg font-bold text-rose-500">회원 탈퇴</h3>
      <p className="mt-2 text-sm text-gray-600 leading-relaxed">
        탈퇴하면 계정과 함께 <b>작성한 일기와 편지가 모두 삭제</b>됩니다.
        <br />
        아직 도착하지 않은 편지도 사라지며, 되돌릴 수 없어요.
      </p>

      <div className="mt-5 flex justify-end">
        <Button variant="ghostDanger" onClick={() => setOpen(true)}>
          회원 탈퇴
        </Button>
      </div>

      <ConfirmDialog
        isOpen={open}
        title="정말 탈퇴하시겠어요?"
        description={'계정, 일기, 편지가 모두 삭제되며 복구할 수 없습니다.'}
        confirmText={user?.userId}
        confirmLabel="탈퇴하기"
        error={error}
        busy={busy}
        onConfirm={handleConfirm}
        onClose={close}
      />
    </div>
  );
};

export default DangerZone;
