import HomeIcon from '../common/icons/HomeIcon';

const HomeButton = ({ onClick, onOpenMenu, menuExpanded }) => (
  <button
    onClick={onClick}
    onMouseEnter={onOpenMenu}
    onFocus={onOpenMenu}
    className="flex items-center gap-2 px-5 py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200 group"
    aria-haspopup="true"
    aria-expanded={menuExpanded}
  >
    <span className="w-8 h-8 bg-gradient-to-br from-pink-300 to-purple-300 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
      <HomeIcon className="w-5 h-5 text-white" />
    </span>
    <span className="text-pink-500 font-semibold">홈</span>
  </button>
);

export default HomeButton;
