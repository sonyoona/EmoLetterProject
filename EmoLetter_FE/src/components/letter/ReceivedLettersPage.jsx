import { useMemo, useState } from 'react';
import FilterTabs from '../common/FilterTabs';
import PageHeader from '../common/PageHeader';
import { ErrorMessage } from '../common/StatusMessage';
import LetterDetailModal from './LetterDetailModal';
import LetterList from './LetterList';
import useLetterReader from '../../hooks/useLetterReader';
import { useLetter } from '../../contexts/LetterContext';
import { isArrived } from '../../utils/letter';

const ReceivedLettersPage = () => {
  const { receivedLetters, loading, error, refresh } = useLetter();
  const [filter, setFilter] = useState('all');
  const reader = useLetterReader();

  const options = useMemo(
    () => [
      { value: 'all', label: '전체 편지함', count: receivedLetters.length },
      { value: 'read', label: '읽은 편지함', count: receivedLetters.filter((l) => l.isOpened).length },
      {
        value: 'unread',
        label: '읽지 않은 편지함',
        count: receivedLetters.filter((l) => !l.isOpened).length,
      },
    ],
    [receivedLetters]
  );

  const filteredLetters = useMemo(
    () =>
      receivedLetters.filter((letter) => {
        if (filter === 'read') return letter.isOpened;
        if (filter === 'unread') return !letter.isOpened;
        return true;
      }),
    [receivedLetters, filter]
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <PageHeader title="받은 편지함" subtitle="도착한 편지를 눌러 열어보세요" className="mb-8" />

      {error && (
        <div className="mb-6">
          <ErrorMessage onRetry={refresh}>{error}</ErrorMessage>
        </div>
      )}

      <FilterTabs options={options} value={filter} onChange={setFilter} tone="pink" />

      <LetterList
        letters={filteredLetters}
        loading={loading}
        emptyMessage="받은 편지가 없습니다"
        isArrived={isArrived}
        onSelect={reader.open}
      />

      <LetterDetailModal letter={reader.selectedLetter} error={reader.error} onClose={reader.close} />
    </div>
  );
};

export default ReceivedLettersPage;
