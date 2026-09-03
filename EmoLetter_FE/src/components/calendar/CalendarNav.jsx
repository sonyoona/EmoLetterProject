import ChevronLeftIcon from '../common/icons/ChevronLeftIcon';
import ChevronRightIcon from '../common/icons/ChevronRightIcon';
import GradientHeading from '../common/GradientHeading';

const MONTH_NAMES = [
  '1월', '2월', '3월', '4월', '5월', '6월',
  '7월', '8월', '9월', '10월', '11월', '12월',
];

const NavButton = ({ onClick, label, children }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className="w-10 h-10 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-600 flex items-center justify-center transition-all"
  >
    {children}
  </button>
);

const CalendarNav = ({ year, month, onPrev, onNext }) => (
  <div className="mb-8 text-center">
    <div className="flex items-center justify-center gap-4 mb-4">
      <NavButton onClick={onPrev} label="이전 달">
        <ChevronLeftIcon />
      </NavButton>
      <GradientHeading className="text-4xl">
        {year}년 {MONTH_NAMES[month]}
      </GradientHeading>
      <NavButton onClick={onNext} label="다음 달">
        <ChevronRightIcon />
      </NavButton>
    </div>
    <p className="text-pink-400/70 text-sm">감정을 기록하고 편지를 작성해보세요</p>
  </div>
);

export default CalendarNav;
