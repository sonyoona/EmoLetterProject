/** 목록/폼에서 공통으로 쓰는 로딩·에러·빈 상태 표시 */

export const LoadingMessage = ({ children = '불러오는 중...' }) => (
  <div className="text-center py-20 text-pink-400/80">
    <p className="text-lg animate-pulse">{children}</p>
  </div>
);

export const EmptyMessage = ({ children }) => (
  <div className="text-center py-20 text-gray-400">
    <p className="text-xl">{children}</p>
  </div>
);

export const SuccessMessage = ({ children }) => {
  if (!children) return null;
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 px-5 py-4 text-emerald-600">
      <p className="whitespace-pre-line">{children}</p>
    </div>
  );
};

export const ErrorMessage = ({ children, onRetry }) => {
  if (!children) return null;
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50/70 px-5 py-4 text-red-600">
      <p className="whitespace-pre-line">{children}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-2 text-sm font-semibold underline hover:text-red-700">
          다시 시도
        </button>
      )}
    </div>
  );
};
