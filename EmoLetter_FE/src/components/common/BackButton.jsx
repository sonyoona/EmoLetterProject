import ChevronLeftIcon from './icons/ChevronLeftIcon';

const BackButton = ({ onClick, label = '돌아가기' }) => (
  <button
    onClick={onClick}
    className="mb-6 flex items-center gap-2 text-pink-500 hover:text-pink-600 transition-colors"
  >
    <ChevronLeftIcon className="w-5 h-5" />
    {label}
  </button>
);

export default BackButton;
