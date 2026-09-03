const TABS = [
  { mode: 'login', label: '로그인', active: 'bg-gradient-to-r from-pink-300 to-pink-400 text-white shadow-md', idle: 'text-pink-400 hover:text-pink-500' },
  { mode: 'signup', label: '회원가입', active: 'bg-gradient-to-r from-purple-300 to-purple-400 text-white shadow-md', idle: 'text-purple-400 hover:text-purple-500' },
];

const AuthTabs = ({ mode, onChange }) => (
  <div className="flex gap-2 mb-8 bg-pink-50/50 rounded-2xl p-1">
    {TABS.map((tab) => (
      <button
        key={tab.mode}
        type="button"
        onClick={() => onChange(tab.mode)}
        className={`flex-1 py-3 font-semibold rounded-xl transition-all duration-200 ${
          mode === tab.mode ? tab.active : tab.idle
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default AuthTabs;
