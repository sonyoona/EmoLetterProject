import { useEffect, useState } from 'react';
import Button from './Button';
import Modal from './Modal';
import TextField from './TextField';
import { ErrorMessage } from './StatusMessage';

/**
 * 되돌릴 수 없는 동작을 실행하기 전에 한 번 더 묻는 창.
 *
 * confirmText를 넘기면 사용자가 그 문자열을 정확히 입력해야 버튼이 열린다.
 * 편지 삭제처럼 다시 만들 수 있는 것은 그냥 확인만, 회원 탈퇴처럼 복구가 불가능한 것은
 * 손으로 한 번 타이핑하게 만들어 실수로 누르는 일을 줄인다.
 */
const ConfirmDialog = ({
  isOpen,
  title,
  description,
  confirmText,
  confirmLabel = '확인',
  cancelLabel = '취소',
  error,
  busy = false,
  onConfirm,
  onClose,
}) => {
  const [typed, setTyped] = useState('');

  // 창을 닫았다 다시 열면 입력값이 남아 있지 않게 한다.
  useEffect(() => {
    if (!isOpen) setTyped('');
  }, [isOpen]);

  const ready = !busy && (!confirmText || typed.trim() === confirmText);

  return (
    <Modal isOpen={isOpen} onClose={busy ? () => {} : onClose} className="max-w-md">
      <div className="space-y-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl leading-none">⚠️</span>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            {description && (
              <p className="mt-2 text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {confirmText && (
          <TextField
            label={
              <>
                확인을 위해 <b className="text-rose-500">{confirmText}</b> 를 입력해주세요
              </>
            }
            value={typed}
            onChange={(event) => setTyped(event.target.value)}
            placeholder={confirmText}
            autoComplete="off"
          />
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="neutral" onClick={onClose} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={!ready}>
            {busy ? '처리 중...' : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
