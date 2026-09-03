import { MENU_ITEMS } from '../../constants/views';

const HeaderMenu = ({ onSelect, onMouseEnter }) => (
  <div
    className="absolute top-full left-0 mt-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-pink-100 py-2 min-w-[180px] z-50 animate-fade-in"
    onMouseEnter={onMouseEnter}
  >
    {MENU_ITEMS.map((item) => (
      <button
        key={item.view}
        onClick={() => onSelect(item.view)}
        className={`w-full text-left px-5 py-3 hover:bg-gradient-to-r ${item.hover} hover:to-transparent text-gray-700 transition-all duration-200 flex items-center gap-3 group`}
      >
        <span className={`w-2 h-2 rounded-full ${item.dot} group-hover:scale-125 transition-transform`} />
        <span className="font-medium">{item.label}</span>
      </button>
    ))}
  </div>
);

export default HeaderMenu;
