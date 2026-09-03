import { useMemo, useState } from 'react';
import ConfirmDialog from '../common/ConfirmDialog';
import FilterTabs from '../common/FilterTabs';
import PageHeader from '../common/PageHeader';
import { ErrorMessage } from '../common/StatusMessage';
import LetterDetailModal from './LetterDetailModal';
import LetterEditModal from './LetterEditModal';
import LetterList from './LetterList';
import useLetterEditor from '../../hooks/useLetterEditor';
import useLetterReader from '../../hooks/useLetterReader';
import { useLetter } from '../../contexts/LetterContext';
import { isArrived, isEditable } from '../../utils/letter';

const SentLettersPage = () => {
  const { sentLetters, loading, error, refresh } = useLetter();
  const [filter, setFilter] = useState('all');
  const reader = useLetterReader();
  const editor = useLetterEditor();

  const options = useMemo(
    () => [
      { value: 'all', label: '전체 편지함', count: sentLetters.length },
      { value: 'read', label: '읽은 편지함', count: sentLetters.filter((l) => l.isOpened).length },
      { value: 'unread', label: '읽지 않은 편지함', count: sentLetters.filter((l) => !l.isOpened).length },
    ],
    [sentLetters]
  );

  const filteredLetters = useMemo(
    () =>
      sentLetters.filter((letter) => {
        if (filter === 'read') return letter.isOpened;
        if (filter === 'unread') return !letter.isOpened;
        return true;
      }),
    [sentLetters, filter]
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <PageHeader title="보낸 편지함" subtitle="미래의 나에게 보낸 편지들이에요" className="mb-8" />

      {error && (
        <div className="mb-6">
          <ErrorMessage onRetry={refresh}>{error}</ErrorMessage>
        </div>
      )}

      {/* 창을 닫은 뒤에도 실패 사유가 남도록 목록 위에 띄운다. */}
      {editor.error && !editor.editing && !editor.deleting && (
        <div className="mb-6">
          <ErrorMessage>{editor.error}</ErrorMessage>
        </div>
      )}

      <FilterTabs options={options} value={filter} onChange={setFilter} tone="purple" />

      <LetterList
        letters={filteredLetters}
        loading={loading}
        emptyMessage="편지가 없습니다"
        isArrived={isArrived}
        canEdit={isEditable}
        onSelect={reader.open}
        onEdit={editor.openEdit}
        onDelete={editor.openDelete}
      />

      <LetterDetailModal letter={reader.selectedLetter} error={reader.error} onClose={reader.close} />

      <LetterEditModal
        letter={editor.editing}
        error={editor.editing ? editor.error : null}
        busy={editor.busy}
        onSave={editor.save}
        onClose={editor.close}
      />

      <ConfirmDialog
        isOpen={Boolean(editor.deleting)}
        title="편지를 삭제할까요?"
        description={'삭제한 편지는 되돌릴 수 없어요.\n미래의 내가 받을 편지 한 통이 사라집니다.'}
        confirmLabel="삭제"
        error={editor.deleting ? editor.error : null}
        busy={editor.busy}
        onConfirm={editor.confirmDelete}
        onClose={editor.close}
      />
    </div>
  );
};

export default SentLettersPage;
