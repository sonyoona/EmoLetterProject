const LetterStatusBadge = ({ isOpened, isDelivered }) => {
  if (isOpened) {
    return (
      <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
        읽음
      </span>
    );
  }
  if (!isDelivered) {
    return (
      <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm font-medium">
        배달 대기
      </span>
    );
  }
  return (
    <span className="px-3 py-1 bg-pink-200 text-pink-700 rounded-full text-sm font-medium animate-pulse">
      읽지 않음
    </span>
  );
};

export default LetterStatusBadge;
